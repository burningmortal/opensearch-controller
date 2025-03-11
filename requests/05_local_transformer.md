# local transformer

## コネクタのURLを信頼

```http
PUT {{host}}/_cluster/settings
Content-Type: application/json
Authorization: Basic {{user}}:{{password}}

{
  "persistent": {
    "plugins.ml_commons.trusted_connector_endpoints_regex": [
      "^https?://host.docker.internal:8000/.*$"
    ]
  }
}
```

## コネクタ作成 rw-5hZUBrZev78hOGoHl"

```http
POST {{host}}/_plugins/_ml/connectors/_create
Content-Type: application/json
Authorization: Basic {{user}}:{{password}}

{
  "name": "local-embedding-connector",
  "description": "HTTPコネクタ for embedding API",
  "version": 1,
  "protocol": "http",
  "parameters": {
    "endpoint": "http://host.docker.internal:8000",
    "timeout": 30000
  },
  "credential": {
    "type": "none"
  },
  "actions": [
    {
      "action_type": "predict",
      "method": "POST",
      "url": "${parameters.endpoint}/encode",
      "request_body": "{ \"text\": \"${parameters.text}\" }",
      "headers": {
        "Content-Type": "application/json"
      },
      "response_processors": [
        {
          "processor_type": "path_extract",
          "return_paths": ["data.0.embedding"]
        }
      ]
    }
  ]
}
```

## モデル作成 taskid: sQ-8hZUBrZev78hOCYEp, modelid: sg-8hZUBrZev78hOCYGq

```http
POST {{host}}/_plugins/_ml/models/_register
Content-Type: application/json
Authorization: Basic {{user}}:{{password}}

{
  "name": "local-embedding-model",
  "function_name": "remote",
  "description": "ローアルのembedding APIモデル (minilm l6 v2)",
  "connector_id": "rw-5hZUBrZev78hOGoHl",
  "model_config": {
    "model_type": "embedding",
    "embedding_dimension": 384,
    "framework_type": "sentence_transformers"
  }
}
```

## モデル一覧を取得

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

## インデックス作成

```http
PUT {{host}}/articles-local-nlp
Content-Type: application/json
Authorization: Basic {{user}}:{{password}}

{
  "settings": {
    "index": {
      "knn": true,
      "number_of_shards": 1,
      "number_of_replicas": 0
    }
  },
  "mappings": {
    "properties": {
      "text_field": {
        "type": "text"
      },
      "embedding_vector": {
        "type": "knn_vector",
        "model_id": "sg-8hZUBrZev78hOCYGq"
      }
    }
  }
}
```

## ドキュメント作成

```http
POST {{host}}/articles-local-nlp/_doc
Content-Type: application/json
Authorization: Basic {{user}}:{{password}}

{
  "text": "嘘の火花"
}
```

## 検索

```http
GET {{host}}/articles-local-nlp/_search
Content-Type: application/json
Authorization: Basic {{user}}:{{password}}

{
  "query": {
    "knn": {
      "embedding_vector": {
        "vector_query_text": "ほほ",
        "model_id": "sg-8hZUBrZev78hOCYGq",
        "k": 10
      }
    }
  }
}
```