# external host model

## モデルグループ一覧取得 sA-8hZUBrZev78hOCIHN

```http
GET {{host}}/_plugins/_ml/model_groups/_search
Content-Type: application/json
Authorization: Basic {{user}}:{{password}}

{
  "query": {
    "match_all": {}
  }
}
```

## モデル一覧取得

```http
GET {{host}}/_plugins/_ml/models/_search
Content-Type: application/json
Authorization: Basic {{user}}:{{password}}

{
  "query": {
    "match_all": {}
  }
}
```

## コネクタ作成 wA_7hZUBrZev78hONIE7

```http
POST {{host}}/_plugins/_ml/connectors/_create
Content-Type: application/json
Authorization: Basic {{user}}:{{password}}

{
  "name": "local connector 1",
  "description": "ローカルのmebeddingサーバに接続するコネクタ",
  "version": 1,
  "protocol": "http",
  "parameters": {
    "endpoint": "host.docker.internal:8000"
  },
  "credential": {
    "type": "none"
  },
  "actions": [
    {
      "action_type": "predict",
      "method": "POST",
      "url": "http://${parameters.endpoint}/encode",
      "headers": {
        "Content-Type": "application/json"
      },
      "request_body": "{ \"text\": \"${parameters.text}\" }"
    }
  ]
}
```

## モデルを登録する wg_8hZUBrZev78hOhoGI

```http
POST {{host}}/_plugins/_ml/models/_register
Content-Type: application/json
Authorization: Basic {{user}}:{{password}}

{
  "name": "local model 1",
  "function_name": "remote",
  "model_group_id": "sA-8hZUBrZev78hOCIHN",
  "description": "ローカルのモデル",
  "connector_id": "wA_7hZUBrZev78hONIE7"
}
```

## モデルをデプロイする taskId: xg_-hZUBrZev78hO5YFt

```http
POST {{host}}/_plugins/_ml/models/wg_8hZUBrZev78hOhoGI/_deploy
Content-Type: application/json
Authorization: Basic {{user}}:{{password}}
```

## プライベートIPのモデルを使えるようにする

```http
PUT {{host}}/_cluster/settings
Content-Type: application/json
Authorization: Basic {{user}}:{{password}}

{
  "persistent": {
    "plugins": {
      "ml_commons": {
        "connector.private_ip_enabled": "true"
      }
    }
  }
}
```

## モデルのテスト

```http
POST {{host}}/_plugins/_ml/models/wg_8hZUBrZev78hOhoGI/_predict
Content-Type: application/json
Authorization: Basic {{user}}:{{password}}

{
  "parameters": {
    "text": "叶わないよ"
  }
}
```

## モデルをアンデプロイする taskId: xg_-hZUBrZev78hO5YFt

```http
POST {{host}}/_plugins/_ml/models/wg_8hZUBrZev78hOhoGI/_undeploy
Content-Type: application/json
Authorization: Basic {{user}}:{{password}}
```

## コネクタ更新 wA_7hZUBrZev78hONIE7

```http
PUT {{host}}/_plugins/_ml/connectors/wA_7hZUBrZev78hONIE7
Content-Type: application/json
Authorization: Basic {{user}}:{{password}}

{
  "actions": [
    {
      "action_type": "predict",
      "method": "POST",
      "url": "http://${parameters.endpoint}/encode",
      "headers": {
        "Content-Type": "application/json"
      },
      "request_body": "{ \"text\": \"${parameters.text}\" }"
    }
  ]
}
```

ここまででモデルを使ってembeddingを計算できるようになった

データの取り込み時にembeddingの計算を同時に行い、インデックスに保存されるようにしたい

---------

