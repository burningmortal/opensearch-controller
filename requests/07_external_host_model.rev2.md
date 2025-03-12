# external host model rev2

## クラスタ設定

### クラスタ設定の確認

```http
GET {{host}}/_cluster/settings
Content-Type: application/json
Authorization: Basic {{user}}:{{password}}
```

### クラスタ設定変更

```http
PUT {{host}}/_cluster/settings
Content-Type: application/json
Authorization: Basic {{user}}:{{password}}

{
  "persistent": {
    "plugins": {
      "ml_commons": {
        "trusted_connector_endpoints_regex": ["^https?://host.docker.internal:8000/.*$"],
        "model_auto_deploy.enable": "true",
        "connector.private_ip_enabled": "true"
      }
    }
  }
}
```

## モデル

### モデルグループ一覧取得

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

### モデルグループ登録

```http
POST {{host}}/_plugins/_ml/model_groups/_register
Content-Type: application/json
Authorization: Basic {{user}}:{{password}}

{
  "name": "remote_model_group",
  "description": "external hosted model group"
}
```

## コネクタ作成

### コネクタ一覧

```http
GET {{host}}/_plugins/_ml/connectors/_search
Content-Type: application/json
Authorization: Basic {{user}}:{{password}}

{
  "query": {
    "match_all": {}
  }
}
```

### コネクタ作る

```http
POST {{host}}/_plugins/_ml/connectors/_create
Content-Type: application/json
Authorization: Basic {{user}}:{{password}}

{
  "name": "localhost hosted embeddings model server connector",
  "description": "ローカルでホストしているembeddingsモデルサーバに接続するためのコネクタ",
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
      "request_body": "{ \"text\": \"${parameters.text}\" }",
      "pre_process_function": "\n return '{' + '\"parameters\"' + '{' + params.text_docs[0] + '}' + '}' ",
      "post_process_function": "connector.post_process.default.embedding"
    }
  ]
}
```