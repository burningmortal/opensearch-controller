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
      "request_body": "{ \"text\": \"${parameters.messages}\" }"
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
    "title_text": "叶わないよ"
  }
}
```

## モデルをアンデプロイする taskId: xg_-hZUBrZev78hO5YFt

```http
POST {{host}}/_plugins/_ml/models/wg_8hZUBrZev78hOhoGI/_undeploy
Content-Type: application/json
Authorization: Basic {{user}}:{{password}}
```

## モデルをデプロイする taskId: xg_-hZUBrZev78hO5YFt

```http
POST {{host}}/_plugins/_ml/models/wg_8hZUBrZev78hOhoGI/_deploy
Content-Type: application/json
Authorization: Basic {{user}}:{{password}}
```

## コネクタ更新 wA_7hZUBrZev78hONIE7

```http
PUT {{host}}/_plugins/_ml/connectors/wA_7hZUBrZev78hONIE7
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
      "request_body": "{ \"text\": \"${parameters.title_text}\" }",
      "pre_process_function": " \n return '{' + '\"parameters\":' + '{' + '\"title_text\":\"' + params.text_docs[0] + '\"' + '}' + '}' ",
      "post_process_function": "connector.post_process.default.embedding"
    }
  ]
}
```

ここまででモデルを使ってembeddingを計算できるようになった

データの取り込み時にembeddingの計算を同時に行い、インデックスに保存されるようにしたい

---------

## 取り込みパイプラインを作成する

```http
PUT {{host}}/_ingest/pipeline/nlp-article-ingest-pipeline-local1
Content-Type: application/json
Authorization: Basic {{user}}:{{password}}

{
  "description": "ローカルでホストしているembeddingモデルの結果を取得するためのパイプライン",
  "processors": [
    {
      "text_embedding": {
        "model_id": "wg_8hZUBrZev78hOhoGI",
        "field_map": {
          "title_text": "title_embedding"
        },
        "batch_size": 5
      }
    }
  ]
}
```

## インデックス削除

```http
DELETE {{host}}/articles-nlp-local1
Authorization: Basic {{user}}:{{password}}
```

## インデックスのマッピングを見る

```http
GET {{host}}/articles-nlp-local1
Authorization: Basic {{user}}:{{password}}
```

## インデックスを作成する

```http
PUT {{host}}/articles-nlp-local1
Content-Type: application/json
Authorization: Basic {{user}}:{{password}}

{
  "settings": {
    "index": {
      "number_of_shards": 1,
      "knn": true,
      "knn.algo_param.ef_search": 100
    },
    "analysis": {
      "char_filter": {
        "normalize": {
          "type": "icu_normalizer",
          "name": "nfkc",
          "mode": "compose"
        }
      },
      "analyzer": {
        "kuromoji_analyzer": {
          "type": "custom",
          "char_filter": [
            "normalize"
          ],
          "tokenizer": "kuromoji_tokenizer",
          "filter": [
            "kuromoji_readingform"
          ]
        }
      }
    }
  },
  "mappings": {
    "properties": {
      "title_text": {
        "type": "text",
        "analyzer": "kuromoji_analyzer",
        "search_analyzer": "kuromoji_analyzer"
      },
      "title_embedding": {
        "type": "knn_vector",
        "dimension": 384,
        "method": {
          "engine": "nmslib",
          "space_type": "l2",
          "name": "hnsw",
          "parameters": {
            "ef_construction": 128,
            "m": 24
          }
        }
      }
    }
  }
}
```

## インデックスにドキュメントを入れる

```http
POST {{host}}/_bulk?batch_size=5&pipeline=nlp-article-ingest-pipeline-local1
Content-Type: application/x-ndjson
Authorization: Basic {{user}}:{{password}}

{ "create": { "_index": "articles-nlp-local1", "_id": "a1" } }
{ "title_text": "その他大勢" }
{ "create": { "_index": "articles-nlp-local1", "_id": "a2" } }
{ "title_text": "たくさんの人" }
{ "create": { "_index": "articles-nlp-local1", "_id": "a3" } }
{ "title_text": "群衆" }
{ "create": { "_index": "articles-nlp-local1", "_id": "a4" } }
{ "title_text": "りんご" }
{ "create": { "_index": "articles-nlp-local1", "_id": "a5" } }
{ "title_text": "西瓜" }
{ "create": { "_index": "articles-nlp-local1", "_id": "a6" } }
{ "title_text": "グレープフルーツ" }
{ "create": { "_index": "articles-nlp-local1", "_id": "a7" } }
{ "title_text": "グレープ" }
{ "create": { "_index": "articles-nlp-local1", "_id": "a8" } }
{ "title_text": "ブドウ" }
{ "create": { "_index": "articles-nlp-local1", "_id": "a9" } }
{ "title_text": "取り扱い説明書" }
{ "create": { "_index": "articles-nlp-local1", "_id": "a10" } }
{ "title_text": "取扱説明書" }
{ "create": { "_index": "articles-nlp-local1", "_id": "a11" } }
{ "title_text": "説明書" }
{ "create": { "_index": "articles-nlp-local1", "_id": "a12" } }
{ "title_text": "ユーザーマニュアル" }
{ "create": { "_index": "articles-nlp-local1", "_id": "a13" } }
{ "title_text": "ガイドライン" }
```

## インデックス全検索

```http
GET {{host}}/articles-nlp-local1/_search
Content-Type: application/json
Authorization: Basic {{user}}:{{password}}

{
  "_source": {
    "exclude": "title_embedding"
  },
  "query": {
    "match_all": {}
  }
}
```

## インデックス削除

```http
DELETE {{host}}/articles-nlp-local1
Authorization: Basic {{user}}:{{password}}
```

## 検索パイプラインを作る

```http
PUT {{host}}/_search/pipeline/nlp-article-search-pipeline-local1
Content-Type: application/json
Authorization: Basic {{user}}:{{password}}

{
  "description": "検索パイプライン　ローカル用",
  "phase_results_processors": [
    {
      "normalization-processor": {
        "normalization": {
          "technique": "min_max"
        },
        "combination": {
          "technique": "arithmetic_mean",
          "parameters": {
            "weights": [0.3, 0.7]
          }
        }
      }
    }
  ]
}
```

## ハイブリッド検索する

```http

@word = ガイドライン

GET {{host}}/articles-nlp-local1/_search?search_pipeline=nlp-article-search-pipeline-local1
Content-Type: application/json
Authorization: Basic {{user}}:{{password}}

{
  "_source": {
    "exclude": "title_embedding"
  },
  "query": {
    "hybrid": {
      "queries": [
        {
          "match": {
            "title_text": {
              "query": "{{word}}"
            }
          }
        },
        {
          "neural": {
            "title_embedding": {
              "query_text": "{{word}}",
              "model_id": "wg_8hZUBrZev78hOhoGI",
              "k": 5
            }
          }
        }
      ]
    }
  }
}
```