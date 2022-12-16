#!/bin/bash

timestamp=$(echo $(($(date +%s%N)/1000000)))

function makeSignature(){
        METHOD="POST"
        URI="/api/v1/project/5043/stage/5806/scenario/6091/deploy"

        SIG="$METHOD"' '"$URI"
        SIG+="\n$timestamp\n"
        SIG+="$accessKey"

        echo -n -e "$SIG"
        SIGNATURE=$(echo -n -e "$SIG"|iconv -t utf8 |openssl dgst -sha256 -hmac $secretKey -binary|openssl enc -base64)
}

makeSignature

curl -v -i -X POST \
        -H "x-ncp-apigw-timestamp:${timestamp}" \
        -H "x-ncp-iam-access-key:${accessKey}" \
        -H "x-ncp-apigw-signature-v2:${SIGNATURE}" \
        -H "x-ncp-region_code:KR" \
        'https://sourcedeploy.apigw.ntruss.com/api/v1/project/5043/stage/5806/scenario/6091/deploy'