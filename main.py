# -*- coding: utf-8 -*-
import base64
import binascii
import io
import re
from typing import Tuple

import deps.protoinspector.lib.types
from flask import Flask, render_template, request, abort, Response

app = Flask("protobuf-viewer")


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/", methods=["POST"])
def form_process():
    processors = {"hex": process_hex_proto, "base64": process_base64_proto}
    result = processors[request.form["input-type"]](
        request.form.get("raw-proto-text", "")
    )

    if len(result[0]) > 0:
        return abort(Response("Error while processing Protobuf input", 500))

    return result[1]


def process_proto(proto: bytes) -> Tuple[list, str]:
    parser = deps.protoinspector.lib.types.StandardParser()
    parser.types["root"] = {}
    result = parser.safe_call(
        parser.match_handler("message"), io.BytesIO(proto), "root"
    )
    ansi_escape = re.compile(r'\x1B(?:[@-Z\\-_]|\[[0-?]*[ -/]*[@-~])')
    result = ansi_escape.sub("", result)

    return parser.errors_produced, result


def process_hex_proto(proto: str) -> Tuple[list, str]:
    try:
        raw_repr = bytes.fromhex(proto)

        return process_proto(raw_repr)
    except ValueError as e:
        return [e], f"{e}"


def process_base64_proto(proto: str) -> Tuple[list, str]:
    try:
        raw_repr = base64.standard_b64decode(proto)

        return process_proto(raw_repr)
    except binascii.Error as e:
        return [e], f"{e}"
