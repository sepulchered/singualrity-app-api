
window.onload = function() {
  // Build a system
  let url = window.location.search.match(/url=([^&]+)/);
  if (url && url.length > 1) {
    url = decodeURIComponent(url[1]);
  } else {
    url = window.location.origin;
  }
  let options = {
  "swaggerDoc": {
    "openapi": "3.0.0",
    "paths": {
      "/v2/project": {
        "get": {
          "operationId": "ProjectController_list",
          "summary": "Get list of projects",
          "parameters": [
            {
              "name": "maxCount",
              "required": false,
              "in": "query",
              "description": "Maximum count, integer 1–1000",
              "schema": {
                "maximum": 1000,
                "type": "number"
              }
            },
            {
              "name": "offset",
              "required": false,
              "in": "query",
              "description": "Offset for pagination, integer ≥ 0",
              "schema": {
                "minimum": 0,
                "type": "number"
              }
            },
            {
              "name": "modifiedSince",
              "required": false,
              "in": "query",
              "description": "Return entities modified since the given sync timestamp (full ISO datetime with time component, e.g. 2026-07-01T00:00:00.000Z). Offsets like +03:00 are accepted and normalized to UTC Z before comparison.",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "paginationData",
              "required": false,
              "in": "query",
              "description": "Include `pagination` block in response with `total/count/offset`. Default `false`.",
              "schema": {
                "default": false,
                "type": "boolean"
              }
            },
            {
              "name": "includeRemoved",
              "required": false,
              "in": "query",
              "description": "Include removed projects",
              "schema": {
                "default": false,
                "type": "boolean"
              }
            },
            {
              "name": "includeArchived",
              "required": false,
              "in": "query",
              "description": "Include archived projects",
              "schema": {
                "default": false,
                "type": "boolean"
              }
            },
            {
              "name": "parent",
              "required": false,
              "in": "query",
              "example": "P-123e4567-e89b-12d3-a456-426614174000",
              "description": "Shorthand for `parent.eq` using operator `eq` (equal, =). Single scalar value.",
              "deprecated": false,
              "schema": {
                "type": "string",
                "pattern": "^(?:P)-",
                "format": "singularity-id"
              }
            },
            {
              "name": "journalDate",
              "required": false,
              "in": "query",
              "description": "Shorthand for `journalDate.eq` using operator `eq` (equal, =). ISO 8601 date-time or date-only value.",
              "deprecated": false,
              "example": "2026-05-01T00:00:00.000Z",
              "schema": {
                "type": "string",
                "format": "date-time"
              }
            },
            {
              "name": "deleteDate",
              "required": false,
              "in": "query",
              "description": "Shorthand for `deleteDate.eq` using operator `eq` (equal, =). ISO 8601 date-time or date-only value.",
              "deprecated": false,
              "example": "2026-05-01T00:00:00.000Z",
              "schema": {
                "type": "string",
                "format": "date-time"
              }
            },
            {
              "name": "isNotebook",
              "required": false,
              "in": "query",
              "description": "Shorthand for `isNotebook.eq` using operator `eq` (equal, =). Single scalar value.",
              "deprecated": false,
              "example": true,
              "schema": {
                "type": "boolean"
              }
            },
            {
              "name": "fields",
              "required": false,
              "in": "query",
              "description": "Comma-separated sparse field list. Allowed fields: id, title, note, start, end, showInBasket, emoji, color, externalId, modificatedDate, reviewValidationDate, reviewValidationInterval, parent, parentOrder, journalDate, isNotebook, tags",
              "example": "id,title,note",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "parent.eq",
              "required": false,
              "in": "query",
              "deprecated": false,
              "description": "Filter by `parent` using operator `eq` (equal, =). Single scalar value.",
              "example": "P-123e4567-e89b-12d3-a456-426614174000",
              "schema": {
                "type": "string",
                "pattern": "^(?:P)-",
                "format": "singularity-id"
              }
            },
            {
              "name": "parent.ne",
              "required": false,
              "in": "query",
              "deprecated": false,
              "description": "Filter by `parent` using operator `ne` (not equal or NULL, != / IS NULL). Single scalar value.",
              "example": "P-123e4567-e89b-12d3-a456-426614174000",
              "schema": {
                "type": "string",
                "pattern": "^(?:P)-",
                "format": "singularity-id"
              }
            },
            {
              "name": "parent.in",
              "required": false,
              "in": "query",
              "deprecated": false,
              "description": "Filter by `parent` using operator `in` (in list, IN). Comma-separated list of values.",
              "example": "P-123e4567-e89b-12d3-a456-426614174000,P-223e4567-e89b-12d3-a456-426614174000",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "parent.isSet",
              "required": false,
              "in": "query",
              "deprecated": false,
              "description": "Filter by `parent` using operator `isSet` (is set / is null). Boolean flag: `true` means `IS NOT NULL`, `false` means `IS NULL`.",
              "example": false,
              "schema": {
                "type": "boolean",
                "enum": [
                  true,
                  false
                ]
              }
            },
            {
              "name": "journalDate.eq",
              "required": false,
              "in": "query",
              "deprecated": false,
              "description": "Filter by `journalDate` using operator `eq` (equal, =). ISO 8601 date-time or date-only value.",
              "example": "2026-05-01T00:00:00.000Z",
              "schema": {
                "type": "string",
                "format": "date-time"
              }
            },
            {
              "name": "journalDate.gt",
              "required": false,
              "in": "query",
              "deprecated": false,
              "description": "Filter by `journalDate` using operator `gt` (greater than, >). ISO 8601 date-time or date-only value.",
              "example": "2026-05-01T00:00:00.000Z",
              "schema": {
                "type": "string",
                "format": "date-time"
              }
            },
            {
              "name": "journalDate.gte",
              "required": false,
              "in": "query",
              "deprecated": false,
              "description": "Filter by `journalDate` using operator `gte` (greater than or equal, >=). ISO 8601 date-time or date-only value.",
              "example": "2026-05-01T00:00:00.000Z",
              "schema": {
                "type": "string",
                "format": "date-time"
              }
            },
            {
              "name": "journalDate.lt",
              "required": false,
              "in": "query",
              "deprecated": false,
              "description": "Filter by `journalDate` using operator `lt` (less than, <). ISO 8601 date-time or date-only value.",
              "example": "2026-05-01T00:00:00.000Z",
              "schema": {
                "type": "string",
                "format": "date-time"
              }
            },
            {
              "name": "journalDate.lte",
              "required": false,
              "in": "query",
              "deprecated": false,
              "description": "Filter by `journalDate` using operator `lte` (less than or equal, <=). ISO 8601 date-time or date-only value.",
              "example": "2026-05-01T00:00:00.000Z",
              "schema": {
                "type": "string",
                "format": "date-time"
              }
            },
            {
              "name": "journalDate.isSet",
              "required": false,
              "in": "query",
              "deprecated": false,
              "description": "Filter by `journalDate` using operator `isSet` (is set / is null). Boolean flag: `true` means `IS NOT NULL`, `false` means `IS NULL`.",
              "example": false,
              "schema": {
                "type": "boolean",
                "enum": [
                  true,
                  false
                ]
              }
            },
            {
              "name": "deleteDate.eq",
              "required": false,
              "in": "query",
              "deprecated": false,
              "description": "Filter by `deleteDate` using operator `eq` (equal, =). ISO 8601 date-time or date-only value.",
              "example": "2026-05-01T00:00:00.000Z",
              "schema": {
                "type": "string",
                "format": "date-time"
              }
            },
            {
              "name": "deleteDate.gt",
              "required": false,
              "in": "query",
              "deprecated": false,
              "description": "Filter by `deleteDate` using operator `gt` (greater than, >). ISO 8601 date-time or date-only value.",
              "example": "2026-05-01T00:00:00.000Z",
              "schema": {
                "type": "string",
                "format": "date-time"
              }
            },
            {
              "name": "deleteDate.gte",
              "required": false,
              "in": "query",
              "deprecated": false,
              "description": "Filter by `deleteDate` using operator `gte` (greater than or equal, >=). ISO 8601 date-time or date-only value.",
              "example": "2026-05-01T00:00:00.000Z",
              "schema": {
                "type": "string",
                "format": "date-time"
              }
            },
            {
              "name": "deleteDate.lt",
              "required": false,
              "in": "query",
              "deprecated": false,
              "description": "Filter by `deleteDate` using operator `lt` (less than, <). ISO 8601 date-time or date-only value.",
              "example": "2026-05-01T00:00:00.000Z",
              "schema": {
                "type": "string",
                "format": "date-time"
              }
            },
            {
              "name": "deleteDate.lte",
              "required": false,
              "in": "query",
              "deprecated": false,
              "description": "Filter by `deleteDate` using operator `lte` (less than or equal, <=). ISO 8601 date-time or date-only value.",
              "example": "2026-05-01T00:00:00.000Z",
              "schema": {
                "type": "string",
                "format": "date-time"
              }
            },
            {
              "name": "deleteDate.isSet",
              "required": false,
              "in": "query",
              "deprecated": false,
              "description": "Filter by `deleteDate` using operator `isSet` (is set / is null). Boolean flag: `true` means `IS NOT NULL`, `false` means `IS NULL`.",
              "example": false,
              "schema": {
                "type": "boolean",
                "enum": [
                  true,
                  false
                ]
              }
            },
            {
              "name": "isNotebook.eq",
              "required": false,
              "in": "query",
              "deprecated": false,
              "description": "Filter by `isNotebook` using operator `eq` (equal, =). Single scalar value.",
              "example": true,
              "schema": {
                "type": "boolean"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/ProjectListResponseDto"
                  }
                }
              }
            }
          },
          "tags": [
            "project"
          ],
          "security": [
            {
              "rest-token": []
            }
          ]
        },
        "post": {
          "operationId": "ProjectController_create",
          "summary": "Create project",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ProjectCreateDto"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/ProjectCreateResponseDto"
                  }
                }
              }
            }
          },
          "tags": [
            "project"
          ],
          "security": [
            {
              "rest-token": []
            }
          ]
        }
      },
      "/v2/project/{id}": {
        "get": {
          "operationId": "ProjectController_getById",
          "summary": "Get project by ID",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "includeRemoved",
              "required": false,
              "in": "query",
              "description": "Include deleted entities. Default `false`.",
              "example": "false",
              "schema": {
                "enum": [
                  "true",
                  "false"
                ],
                "type": "string"
              }
            },
            {
              "name": "fields",
              "required": false,
              "in": "query",
              "description": "Comma-separated sparse field list. Allowed fields: id, title, note, start, end, showInBasket, emoji, color, externalId, modificatedDate, reviewValidationDate, reviewValidationInterval, parent, parentOrder, journalDate, isNotebook, tags",
              "example": "id,title,note",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/ProjectResponseDto"
                  }
                }
              }
            }
          },
          "tags": [
            "project"
          ],
          "security": [
            {
              "rest-token": []
            }
          ]
        },
        "patch": {
          "operationId": "ProjectController_update",
          "summary": "Update project",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ProjectUpdateDto"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/ProjectResponseDto"
                  }
                }
              }
            }
          },
          "tags": [
            "project"
          ],
          "security": [
            {
              "rest-token": []
            }
          ]
        },
        "delete": {
          "operationId": "ProjectController_delete",
          "summary": "Delete project",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "204": {
              "description": ""
            }
          },
          "tags": [
            "project"
          ],
          "security": [
            {
              "rest-token": []
            }
          ]
        }
      },
      "/v2/project/{id}/archive": {
        "post": {
          "operationId": "ProjectController_archive",
          "summary": "Archive project",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ProjectArchiveDto"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/ProjectResponseDto"
                  }
                }
              }
            }
          },
          "tags": [
            "project"
          ],
          "security": [
            {
              "rest-token": []
            }
          ]
        }
      },
      "/v2/project/{id}/unarchive": {
        "post": {
          "operationId": "ProjectController_unarchive",
          "summary": "Unarchive project",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/ProjectResponseDto"
                  }
                }
              }
            }
          },
          "tags": [
            "project"
          ],
          "security": [
            {
              "rest-token": []
            }
          ]
        }
      },
      "/v2/task-group": {
        "get": {
          "operationId": "TaskGroupController_list",
          "summary": "Get list of task groups",
          "parameters": [
            {
              "name": "maxCount",
              "required": false,
              "in": "query",
              "description": "Maximum count, integer 1–1000",
              "schema": {
                "maximum": 1000,
                "type": "number"
              }
            },
            {
              "name": "offset",
              "required": false,
              "in": "query",
              "description": "Offset for pagination, integer ≥ 0",
              "schema": {
                "minimum": 0,
                "type": "number"
              }
            },
            {
              "name": "modifiedSince",
              "required": false,
              "in": "query",
              "description": "Return entities modified since the given sync timestamp (full ISO datetime with time component, e.g. 2026-07-01T00:00:00.000Z). Offsets like +03:00 are accepted and normalized to UTC Z before comparison.",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "paginationData",
              "required": false,
              "in": "query",
              "description": "Include `pagination` block in response with `total/count/offset`. Default `false`.",
              "schema": {
                "default": false,
                "type": "boolean"
              }
            },
            {
              "name": "includeRemoved",
              "required": false,
              "in": "query",
              "description": "Include removed task groups",
              "schema": {
                "default": false,
                "type": "boolean"
              }
            },
            {
              "name": "parent",
              "required": false,
              "in": "query",
              "example": "P-123e4567-e89b-12d3-a456-426614174000",
              "description": "Shorthand for `parent.eq` using operator `eq` (equal, =). Single scalar value.",
              "deprecated": false,
              "schema": {
                "type": "string",
                "pattern": "^(?:P)-",
                "format": "singularity-id"
              }
            },
            {
              "name": "fields",
              "required": false,
              "in": "query",
              "description": "Comma-separated sparse field list. Allowed fields: id, title, externalId, modificatedDate, parent, parentOrder, fake",
              "example": "id,title,externalId",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "parent.eq",
              "required": false,
              "in": "query",
              "deprecated": false,
              "description": "Filter by `parent` using operator `eq` (equal, =). Single scalar value.",
              "example": "P-123e4567-e89b-12d3-a456-426614174000",
              "schema": {
                "type": "string",
                "pattern": "^(?:P)-",
                "format": "singularity-id"
              }
            },
            {
              "name": "parent.in",
              "required": false,
              "in": "query",
              "deprecated": false,
              "description": "Filter by `parent` using operator `in` (in list, IN). Comma-separated list of values.",
              "example": "P-123e4567-e89b-12d3-a456-426614174000,P-223e4567-e89b-12d3-a456-426614174000",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/TaskGroupListResponseDto"
                  }
                }
              }
            }
          },
          "tags": [
            "taskGroup"
          ],
          "security": [
            {
              "rest-token": []
            }
          ]
        },
        "post": {
          "operationId": "TaskGroupController_create",
          "summary": "Create task group",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/TaskGroupCreateDto"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/TaskGroupResponseDto"
                  }
                }
              }
            }
          },
          "tags": [
            "taskGroup"
          ],
          "security": [
            {
              "rest-token": []
            }
          ]
        }
      },
      "/v2/task-group/{id}": {
        "get": {
          "operationId": "TaskGroupController_getById",
          "summary": "Get task group by ID",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "includeRemoved",
              "required": false,
              "in": "query",
              "description": "Include deleted entities. Default `false`.",
              "example": "false",
              "schema": {
                "enum": [
                  "true",
                  "false"
                ],
                "type": "string"
              }
            },
            {
              "name": "fields",
              "required": false,
              "in": "query",
              "description": "Comma-separated sparse field list. Allowed fields: id, title, externalId, modificatedDate, parent, parentOrder, fake",
              "example": "id,title,externalId",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/TaskGroupResponseDto"
                  }
                }
              }
            }
          },
          "tags": [
            "taskGroup"
          ],
          "security": [
            {
              "rest-token": []
            }
          ]
        },
        "patch": {
          "operationId": "TaskGroupController_update",
          "summary": "Update task group",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/TaskGroupUpdateDto"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/TaskGroupResponseDto"
                  }
                }
              }
            }
          },
          "tags": [
            "taskGroup"
          ],
          "security": [
            {
              "rest-token": []
            }
          ]
        },
        "delete": {
          "operationId": "TaskGroupController_delete",
          "summary": "Delete task group",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "204": {
              "description": ""
            }
          },
          "tags": [
            "taskGroup"
          ],
          "security": [
            {
              "rest-token": []
            }
          ]
        }
      },
      "/v2/task": {
        "get": {
          "operationId": "TaskController_list",
          "summary": "Get list of tasks",
          "parameters": [
            {
              "name": "maxCount",
              "required": false,
              "in": "query",
              "description": "Maximum count, integer 1–1000",
              "schema": {
                "maximum": 1000,
                "type": "number"
              }
            },
            {
              "name": "offset",
              "required": false,
              "in": "query",
              "description": "Offset for pagination, integer ≥ 0",
              "schema": {
                "minimum": 0,
                "type": "number"
              }
            },
            {
              "name": "modifiedSince",
              "required": false,
              "in": "query",
              "description": "Return entities modified since the given sync timestamp (full ISO datetime with time component, e.g. 2026-07-01T00:00:00.000Z). Offsets like +03:00 are accepted and normalized to UTC Z before comparison.",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "paginationData",
              "required": false,
              "in": "query",
              "description": "Include `pagination` block in response with `total/count/offset`. Default `false`.",
              "schema": {
                "default": false,
                "type": "boolean"
              }
            },
            {
              "name": "includeRemoved",
              "required": false,
              "in": "query",
              "description": "Include removed tasks",
              "schema": {
                "default": false,
                "type": "boolean"
              }
            },
            {
              "name": "includeArchived",
              "required": false,
              "in": "query",
              "description": "Include archived tasks",
              "schema": {
                "default": false,
                "type": "boolean"
              }
            },
            {
              "name": "includeAllRecurrenceInstances",
              "required": false,
              "in": "query",
              "description": "Include all instances of recurring tasks. Default `false`. ⚠️ When `false` (default), the server over-fetches rows and applies a post-filter. As a result `count` in the response can be smaller than the requested `maxCount`, and offset-based pagination may show gaps in the listing. For reliable offset-pagination over `task` pass `includeAllRecurrenceInstances=true`.",
              "schema": {
                "default": false,
                "type": "boolean"
              }
            },
            {
              "name": "projectId",
              "required": false,
              "in": "query",
              "example": "P-123e4567-e89b-12d3-a456-426614174000",
              "description": "Shorthand for `projectId.eq` using operator `eq` (equal, =). Single scalar value.",
              "deprecated": false,
              "schema": {
                "type": "string",
                "pattern": "^(?:P)-",
                "format": "singularity-id"
              }
            },
            {
              "name": "parent",
              "required": false,
              "in": "query",
              "example": "T-123e4567-e89b-12d3-a456-426614174000",
              "description": "Shorthand for `parent.eq` using operator `eq` (equal, =). Single scalar value.",
              "deprecated": false,
              "schema": {
                "type": "string",
                "pattern": "^(?:T)-",
                "format": "singularity-id"
              }
            },
            {
              "name": "group",
              "required": false,
              "in": "query",
              "example": "Q-123e4567-e89b-12d3-a456-426614174000",
              "description": "Shorthand for `group.eq` using operator `eq` (equal, =). Single scalar value.",
              "deprecated": false,
              "schema": {
                "type": "string",
                "pattern": "^(?:Q)-",
                "format": "singularity-id"
              }
            },
            {
              "name": "start",
              "required": false,
              "in": "query",
              "description": "Shorthand for `start.eq` using operator `eq` (equal, =). ISO 8601 date-time or date-only value.",
              "deprecated": false,
              "example": "2026-05-01T00:00:00.000Z",
              "schema": {
                "type": "string",
                "format": "date-time"
              }
            },
            {
              "name": "deadline",
              "required": false,
              "in": "query",
              "description": "Shorthand for `deadline.eq` using operator `eq` (equal, =). ISO 8601 date-time or date-only value.",
              "deprecated": false,
              "example": "2026-05-01T00:00:00.000Z",
              "schema": {
                "type": "string",
                "format": "date-time"
              }
            },
            {
              "name": "journalDate",
              "required": false,
              "in": "query",
              "description": "Shorthand for `journalDate.eq` using operator `eq` (equal, =). ISO 8601 date-time or date-only value.",
              "deprecated": false,
              "example": "2026-05-01T00:00:00.000Z",
              "schema": {
                "type": "string",
                "format": "date-time"
              }
            },
            {
              "name": "deleteDate",
              "required": false,
              "in": "query",
              "description": "Shorthand for `deleteDate.eq` using operator `eq` (equal, =). ISO 8601 date-time or date-only value.",
              "deprecated": false,
              "example": "2026-05-01T00:00:00.000Z",
              "schema": {
                "type": "string",
                "format": "date-time"
              }
            },
            {
              "name": "checked",
              "required": false,
              "in": "query",
              "description": "Shorthand for `checked.eq` using operator `eq` (equal, =). Single scalar value.",
              "deprecated": false,
              "example": 1,
              "schema": {
                "type": "number"
              }
            },
            {
              "name": "priority",
              "required": false,
              "in": "query",
              "description": "Shorthand for `priority.eq` using operator `eq` (equal, =). Single scalar value.",
              "deprecated": false,
              "example": 1,
              "schema": {
                "type": "number"
              }
            },
            {
              "name": "state",
              "required": false,
              "in": "query",
              "description": "Shorthand for `state.eq` using operator `eq` (equal, =). Single scalar value.",
              "deprecated": false,
              "example": 1,
              "schema": {
                "type": "number"
              }
            },
            {
              "name": "isNote",
              "required": false,
              "in": "query",
              "description": "Shorthand for `isNote.eq` using operator `eq` (equal, =). Single scalar value.",
              "deprecated": false,
              "example": true,
              "schema": {
                "type": "boolean"
              }
            },
            {
              "name": "deferred",
              "required": false,
              "in": "query",
              "description": "Shorthand for `deferred.eq` using operator `eq` (equal, =). Single scalar value.",
              "deprecated": false,
              "example": true,
              "schema": {
                "type": "boolean"
              }
            },
            {
              "name": "tags",
              "required": false,
              "in": "query",
              "description": "Shorthand for `tags.in` using operator `in` (in list, IN). Comma-separated list of values.",
              "deprecated": false,
              "example": "A-123e4567-e89b-12d3-a456-426614174000,A-223e4567-e89b-12d3-a456-426614174000",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "fields",
              "required": false,
              "in": "query",
              "description": "Comma-separated sparse field list. Allowed fields: id, title, note, priority, recurrence, journalDate, complete, completeLast, state, checked, showInBasket, deleteDate, projectId, recurrenceGeneratorId, start, notifies, useTime, deferred, deadline, parent, group, modificatedDate, scheduleOrder, parentOrder, timeLength, isNote, tags",
              "example": "id,title,note",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "projectId.eq",
              "required": false,
              "in": "query",
              "deprecated": false,
              "description": "Filter by `projectId` using operator `eq` (equal, =). Single scalar value.",
              "example": "P-123e4567-e89b-12d3-a456-426614174000",
              "schema": {
                "type": "string",
                "pattern": "^(?:P)-",
                "format": "singularity-id"
              }
            },
            {
              "name": "projectId.ne",
              "required": false,
              "in": "query",
              "deprecated": false,
              "description": "Filter by `projectId` using operator `ne` (not equal or NULL, != / IS NULL). Single scalar value.",
              "example": "P-123e4567-e89b-12d3-a456-426614174000",
              "schema": {
                "type": "string",
                "pattern": "^(?:P)-",
                "format": "singularity-id"
              }
            },
            {
              "name": "projectId.in",
              "required": false,
              "in": "query",
              "deprecated": false,
              "description": "Filter by `projectId` using operator `in` (in list, IN). Comma-separated list of values.",
              "example": "P-123e4567-e89b-12d3-a456-426614174000,P-223e4567-e89b-12d3-a456-426614174000",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "projectId.isSet",
              "required": false,
              "in": "query",
              "deprecated": false,
              "description": "Filter by `projectId` using operator `isSet` (is set / is null). Boolean flag: `true` means `IS NOT NULL`, `false` means `IS NULL`.",
              "example": false,
              "schema": {
                "type": "boolean",
                "enum": [
                  true,
                  false
                ]
              }
            },
            {
              "name": "parent.eq",
              "required": false,
              "in": "query",
              "deprecated": false,
              "description": "Filter by `parent` using operator `eq` (equal, =). Single scalar value.",
              "example": "T-123e4567-e89b-12d3-a456-426614174000",
              "schema": {
                "type": "string",
                "pattern": "^(?:T)-",
                "format": "singularity-id"
              }
            },
            {
              "name": "parent.ne",
              "required": false,
              "in": "query",
              "deprecated": false,
              "description": "Filter by `parent` using operator `ne` (not equal or NULL, != / IS NULL). Single scalar value.",
              "example": "T-123e4567-e89b-12d3-a456-426614174000",
              "schema": {
                "type": "string",
                "pattern": "^(?:T)-",
                "format": "singularity-id"
              }
            },
            {
              "name": "parent.in",
              "required": false,
              "in": "query",
              "deprecated": false,
              "description": "Filter by `parent` using operator `in` (in list, IN). Comma-separated list of values.",
              "example": "T-123e4567-e89b-12d3-a456-426614174000,T-223e4567-e89b-12d3-a456-426614174000",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "parent.isSet",
              "required": false,
              "in": "query",
              "deprecated": false,
              "description": "Filter by `parent` using operator `isSet` (is set / is null). Boolean flag: `true` means `IS NOT NULL`, `false` means `IS NULL`.",
              "example": false,
              "schema": {
                "type": "boolean",
                "enum": [
                  true,
                  false
                ]
              }
            },
            {
              "name": "group.eq",
              "required": false,
              "in": "query",
              "deprecated": false,
              "description": "Filter by `group` using operator `eq` (equal, =). Single scalar value.",
              "example": "Q-123e4567-e89b-12d3-a456-426614174000",
              "schema": {
                "type": "string",
                "pattern": "^(?:Q)-",
                "format": "singularity-id"
              }
            },
            {
              "name": "group.ne",
              "required": false,
              "in": "query",
              "deprecated": false,
              "description": "Filter by `group` using operator `ne` (not equal or NULL, != / IS NULL). Single scalar value.",
              "example": "Q-123e4567-e89b-12d3-a456-426614174000",
              "schema": {
                "type": "string",
                "pattern": "^(?:Q)-",
                "format": "singularity-id"
              }
            },
            {
              "name": "group.in",
              "required": false,
              "in": "query",
              "deprecated": false,
              "description": "Filter by `group` using operator `in` (in list, IN). Comma-separated list of values.",
              "example": "Q-123e4567-e89b-12d3-a456-426614174000,Q-223e4567-e89b-12d3-a456-426614174000",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "group.isSet",
              "required": false,
              "in": "query",
              "deprecated": false,
              "description": "Filter by `group` using operator `isSet` (is set / is null). Boolean flag: `true` means `IS NOT NULL`, `false` means `IS NULL`.",
              "example": false,
              "schema": {
                "type": "boolean",
                "enum": [
                  true,
                  false
                ]
              }
            },
            {
              "name": "start.eq",
              "required": false,
              "in": "query",
              "deprecated": false,
              "description": "Filter by `start` using operator `eq` (equal, =). ISO 8601 date-time or date-only value.",
              "example": "2026-05-01T00:00:00.000Z",
              "schema": {
                "type": "string",
                "format": "date-time"
              }
            },
            {
              "name": "start.gt",
              "required": false,
              "in": "query",
              "deprecated": false,
              "description": "Filter by `start` using operator `gt` (greater than, >). ISO 8601 date-time or date-only value.",
              "example": "2026-05-01T00:00:00.000Z",
              "schema": {
                "type": "string",
                "format": "date-time"
              }
            },
            {
              "name": "start.gte",
              "required": false,
              "in": "query",
              "deprecated": false,
              "description": "Filter by `start` using operator `gte` (greater than or equal, >=). ISO 8601 date-time or date-only value.",
              "example": "2026-05-01T00:00:00.000Z",
              "schema": {
                "type": "string",
                "format": "date-time"
              }
            },
            {
              "name": "start.lt",
              "required": false,
              "in": "query",
              "deprecated": false,
              "description": "Filter by `start` using operator `lt` (less than, <). ISO 8601 date-time or date-only value.",
              "example": "2026-05-01T00:00:00.000Z",
              "schema": {
                "type": "string",
                "format": "date-time"
              }
            },
            {
              "name": "start.lte",
              "required": false,
              "in": "query",
              "deprecated": false,
              "description": "Filter by `start` using operator `lte` (less than or equal, <=). ISO 8601 date-time or date-only value.",
              "example": "2026-05-01T00:00:00.000Z",
              "schema": {
                "type": "string",
                "format": "date-time"
              }
            },
            {
              "name": "start.isSet",
              "required": false,
              "in": "query",
              "deprecated": false,
              "description": "Filter by `start` using operator `isSet` (is set / is null). Boolean flag: `true` means `IS NOT NULL`, `false` means `IS NULL`.",
              "example": false,
              "schema": {
                "type": "boolean",
                "enum": [
                  true,
                  false
                ]
              }
            },
            {
              "name": "startDateFrom",
              "required": false,
              "in": "query",
              "deprecated": true,
              "description": "Deprecated alias for `start.gte` using operator `gte` (greater than or equal, >=). ISO 8601 date-time or date-only value.",
              "example": "2026-05-01T00:00:00.000Z",
              "schema": {
                "type": "string",
                "format": "date-time"
              }
            },
            {
              "name": "startDateTo",
              "required": false,
              "in": "query",
              "deprecated": true,
              "description": "Deprecated alias for `start.lte` using operator `lte` (less than or equal, <=). ISO 8601 date-time or date-only value.",
              "example": "2026-05-01T00:00:00.000Z",
              "schema": {
                "type": "string",
                "format": "date-time"
              }
            },
            {
              "name": "deadline.eq",
              "required": false,
              "in": "query",
              "deprecated": false,
              "description": "Filter by `deadline` using operator `eq` (equal, =). ISO 8601 date-time or date-only value.",
              "example": "2026-05-01T00:00:00.000Z",
              "schema": {
                "type": "string",
                "format": "date-time"
              }
            },
            {
              "name": "deadline.gt",
              "required": false,
              "in": "query",
              "deprecated": false,
              "description": "Filter by `deadline` using operator `gt` (greater than, >). ISO 8601 date-time or date-only value.",
              "example": "2026-05-01T00:00:00.000Z",
              "schema": {
                "type": "string",
                "format": "date-time"
              }
            },
            {
              "name": "deadline.gte",
              "required": false,
              "in": "query",
              "deprecated": false,
              "description": "Filter by `deadline` using operator `gte` (greater than or equal, >=). ISO 8601 date-time or date-only value.",
              "example": "2026-05-01T00:00:00.000Z",
              "schema": {
                "type": "string",
                "format": "date-time"
              }
            },
            {
              "name": "deadline.lt",
              "required": false,
              "in": "query",
              "deprecated": false,
              "description": "Filter by `deadline` using operator `lt` (less than, <). ISO 8601 date-time or date-only value.",
              "example": "2026-05-01T00:00:00.000Z",
              "schema": {
                "type": "string",
                "format": "date-time"
              }
            },
            {
              "name": "deadline.lte",
              "required": false,
              "in": "query",
              "deprecated": false,
              "description": "Filter by `deadline` using operator `lte` (less than or equal, <=). ISO 8601 date-time or date-only value.",
              "example": "2026-05-01T00:00:00.000Z",
              "schema": {
                "type": "string",
                "format": "date-time"
              }
            },
            {
              "name": "deadline.isSet",
              "required": false,
              "in": "query",
              "deprecated": false,
              "description": "Filter by `deadline` using operator `isSet` (is set / is null). Boolean flag: `true` means `IS NOT NULL`, `false` means `IS NULL`.",
              "example": false,
              "schema": {
                "type": "boolean",
                "enum": [
                  true,
                  false
                ]
              }
            },
            {
              "name": "journalDate.eq",
              "required": false,
              "in": "query",
              "deprecated": false,
              "description": "Filter by `journalDate` using operator `eq` (equal, =). ISO 8601 date-time or date-only value.",
              "example": "2026-05-01T00:00:00.000Z",
              "schema": {
                "type": "string",
                "format": "date-time"
              }
            },
            {
              "name": "journalDate.gt",
              "required": false,
              "in": "query",
              "deprecated": false,
              "description": "Filter by `journalDate` using operator `gt` (greater than, >). ISO 8601 date-time or date-only value.",
              "example": "2026-05-01T00:00:00.000Z",
              "schema": {
                "type": "string",
                "format": "date-time"
              }
            },
            {
              "name": "journalDate.gte",
              "required": false,
              "in": "query",
              "deprecated": false,
              "description": "Filter by `journalDate` using operator `gte` (greater than or equal, >=). ISO 8601 date-time or date-only value.",
              "example": "2026-05-01T00:00:00.000Z",
              "schema": {
                "type": "string",
                "format": "date-time"
              }
            },
            {
              "name": "journalDate.lt",
              "required": false,
              "in": "query",
              "deprecated": false,
              "description": "Filter by `journalDate` using operator `lt` (less than, <). ISO 8601 date-time or date-only value.",
              "example": "2026-05-01T00:00:00.000Z",
              "schema": {
                "type": "string",
                "format": "date-time"
              }
            },
            {
              "name": "journalDate.lte",
              "required": false,
              "in": "query",
              "deprecated": false,
              "description": "Filter by `journalDate` using operator `lte` (less than or equal, <=). ISO 8601 date-time or date-only value.",
              "example": "2026-05-01T00:00:00.000Z",
              "schema": {
                "type": "string",
                "format": "date-time"
              }
            },
            {
              "name": "journalDate.isSet",
              "required": false,
              "in": "query",
              "deprecated": false,
              "description": "Filter by `journalDate` using operator `isSet` (is set / is null). Boolean flag: `true` means `IS NOT NULL`, `false` means `IS NULL`.",
              "example": false,
              "schema": {
                "type": "boolean",
                "enum": [
                  true,
                  false
                ]
              }
            },
            {
              "name": "deleteDate.eq",
              "required": false,
              "in": "query",
              "deprecated": false,
              "description": "Filter by `deleteDate` using operator `eq` (equal, =). ISO 8601 date-time or date-only value.",
              "example": "2026-05-01T00:00:00.000Z",
              "schema": {
                "type": "string",
                "format": "date-time"
              }
            },
            {
              "name": "deleteDate.gt",
              "required": false,
              "in": "query",
              "deprecated": false,
              "description": "Filter by `deleteDate` using operator `gt` (greater than, >). ISO 8601 date-time or date-only value.",
              "example": "2026-05-01T00:00:00.000Z",
              "schema": {
                "type": "string",
                "format": "date-time"
              }
            },
            {
              "name": "deleteDate.gte",
              "required": false,
              "in": "query",
              "deprecated": false,
              "description": "Filter by `deleteDate` using operator `gte` (greater than or equal, >=). ISO 8601 date-time or date-only value.",
              "example": "2026-05-01T00:00:00.000Z",
              "schema": {
                "type": "string",
                "format": "date-time"
              }
            },
            {
              "name": "deleteDate.lt",
              "required": false,
              "in": "query",
              "deprecated": false,
              "description": "Filter by `deleteDate` using operator `lt` (less than, <). ISO 8601 date-time or date-only value.",
              "example": "2026-05-01T00:00:00.000Z",
              "schema": {
                "type": "string",
                "format": "date-time"
              }
            },
            {
              "name": "deleteDate.lte",
              "required": false,
              "in": "query",
              "deprecated": false,
              "description": "Filter by `deleteDate` using operator `lte` (less than or equal, <=). ISO 8601 date-time or date-only value.",
              "example": "2026-05-01T00:00:00.000Z",
              "schema": {
                "type": "string",
                "format": "date-time"
              }
            },
            {
              "name": "deleteDate.isSet",
              "required": false,
              "in": "query",
              "deprecated": false,
              "description": "Filter by `deleteDate` using operator `isSet` (is set / is null). Boolean flag: `true` means `IS NOT NULL`, `false` means `IS NULL`.",
              "example": false,
              "schema": {
                "type": "boolean",
                "enum": [
                  true,
                  false
                ]
              }
            },
            {
              "name": "checked.eq",
              "required": false,
              "in": "query",
              "deprecated": false,
              "description": "Filter by `checked` using operator `eq` (equal, =). Single scalar value.",
              "example": 1,
              "schema": {
                "type": "number"
              }
            },
            {
              "name": "checked.ne",
              "required": false,
              "in": "query",
              "deprecated": false,
              "description": "Filter by `checked` using operator `ne` (not equal or NULL, != / IS NULL). Single scalar value.",
              "example": 1,
              "schema": {
                "type": "number"
              }
            },
            {
              "name": "checked.in",
              "required": false,
              "in": "query",
              "deprecated": false,
              "description": "Filter by `checked` using operator `in` (in list, IN). Comma-separated list of values.",
              "example": 1,
              "schema": {
                "type": "number"
              }
            },
            {
              "name": "priority.eq",
              "required": false,
              "in": "query",
              "deprecated": false,
              "description": "Filter by `priority` using operator `eq` (equal, =). Single scalar value.",
              "example": 1,
              "schema": {
                "type": "number"
              }
            },
            {
              "name": "priority.ne",
              "required": false,
              "in": "query",
              "deprecated": false,
              "description": "Filter by `priority` using operator `ne` (not equal or NULL, != / IS NULL). Single scalar value.",
              "example": 1,
              "schema": {
                "type": "number"
              }
            },
            {
              "name": "priority.in",
              "required": false,
              "in": "query",
              "deprecated": false,
              "description": "Filter by `priority` using operator `in` (in list, IN). Comma-separated list of values.",
              "example": 1,
              "schema": {
                "type": "number"
              }
            },
            {
              "name": "state.eq",
              "required": false,
              "in": "query",
              "deprecated": false,
              "description": "Filter by `state` using operator `eq` (equal, =). Single scalar value.",
              "example": 1,
              "schema": {
                "type": "number"
              }
            },
            {
              "name": "state.ne",
              "required": false,
              "in": "query",
              "deprecated": false,
              "description": "Filter by `state` using operator `ne` (not equal or NULL, != / IS NULL). Single scalar value.",
              "example": 1,
              "schema": {
                "type": "number"
              }
            },
            {
              "name": "state.in",
              "required": false,
              "in": "query",
              "deprecated": false,
              "description": "Filter by `state` using operator `in` (in list, IN). Comma-separated list of values.",
              "example": 1,
              "schema": {
                "type": "number"
              }
            },
            {
              "name": "isNote.eq",
              "required": false,
              "in": "query",
              "deprecated": false,
              "description": "Filter by `isNote` using operator `eq` (equal, =). Single scalar value.",
              "example": true,
              "schema": {
                "type": "boolean"
              }
            },
            {
              "name": "deferred.eq",
              "required": false,
              "in": "query",
              "deprecated": false,
              "description": "Filter by `deferred` using operator `eq` (equal, =). Single scalar value.",
              "example": true,
              "schema": {
                "type": "boolean"
              }
            },
            {
              "name": "tags.in",
              "required": false,
              "in": "query",
              "deprecated": false,
              "description": "Filter by `tags` using operator `in` (in list, IN). Comma-separated list of values.",
              "example": "A-123e4567-e89b-12d3-a456-426614174000,A-223e4567-e89b-12d3-a456-426614174000",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/TaskListResponseDto"
                  }
                }
              }
            }
          },
          "tags": [
            "task"
          ],
          "security": [
            {
              "rest-token": []
            }
          ]
        },
        "post": {
          "operationId": "TaskController_create",
          "summary": "Create task",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/TaskCreateDto"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/TaskResponseDto"
                  }
                }
              }
            }
          },
          "tags": [
            "task"
          ],
          "security": [
            {
              "rest-token": []
            }
          ]
        }
      },
      "/v2/task/{id}": {
        "get": {
          "operationId": "TaskController_getById",
          "summary": "Get task by ID",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "includeRemoved",
              "required": false,
              "in": "query",
              "description": "Include deleted entities. Default `false`.",
              "example": "false",
              "schema": {
                "enum": [
                  "true",
                  "false"
                ],
                "type": "string"
              }
            },
            {
              "name": "fields",
              "required": false,
              "in": "query",
              "description": "Comma-separated sparse field list. Allowed fields: id, title, note, priority, recurrence, journalDate, complete, completeLast, state, checked, showInBasket, deleteDate, projectId, recurrenceGeneratorId, start, notifies, useTime, deferred, deadline, parent, group, modificatedDate, scheduleOrder, parentOrder, timeLength, isNote, tags",
              "example": "id,title,note",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/TaskResponseDto"
                  }
                }
              }
            }
          },
          "tags": [
            "task"
          ],
          "security": [
            {
              "rest-token": []
            }
          ]
        },
        "patch": {
          "operationId": "TaskController_update",
          "summary": "Update task",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/TaskUpdateDto"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/TaskResponseDto"
                  }
                }
              }
            }
          },
          "tags": [
            "task"
          ],
          "security": [
            {
              "rest-token": []
            }
          ]
        },
        "delete": {
          "operationId": "TaskController_delete",
          "summary": "Delete task",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "204": {
              "description": ""
            }
          },
          "tags": [
            "task"
          ],
          "security": [
            {
              "rest-token": []
            }
          ]
        }
      },
      "/v2/task/{id}/complete": {
        "post": {
          "operationId": "TaskController_complete",
          "summary": "Complete task",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/TaskResponseDto"
                  }
                }
              }
            }
          },
          "tags": [
            "task"
          ],
          "security": [
            {
              "rest-token": []
            }
          ]
        }
      },
      "/v2/task/{id}/uncomplete": {
        "post": {
          "operationId": "TaskController_uncomplete",
          "summary": "Uncomplete task",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/TaskResponseDto"
                  }
                }
              }
            }
          },
          "tags": [
            "task"
          ],
          "security": [
            {
              "rest-token": []
            }
          ]
        }
      },
      "/v2/task/{id}/cancel": {
        "post": {
          "operationId": "TaskController_cancel",
          "summary": "Cancel task",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/TaskResponseDto"
                  }
                }
              }
            }
          },
          "tags": [
            "task"
          ],
          "security": [
            {
              "rest-token": []
            }
          ]
        }
      },
      "/v2/task/{id}/complete-today": {
        "post": {
          "operationId": "TaskController_completeToday",
          "summary": "Complete task for today",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/TaskResponseDto"
                  }
                }
              }
            }
          },
          "tags": [
            "task"
          ],
          "security": [
            {
              "rest-token": []
            }
          ]
        }
      },
      "/v2/task/{id}/archive": {
        "post": {
          "operationId": "TaskController_archive",
          "summary": "Archive task",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ArchiveTaskDto"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/TaskResponseDto"
                  }
                }
              }
            }
          },
          "tags": [
            "task"
          ],
          "security": [
            {
              "rest-token": []
            }
          ]
        }
      },
      "/v2/task/{id}/unarchive": {
        "post": {
          "operationId": "TaskController_unarchive",
          "summary": "Unarchive task",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/TaskResponseDto"
                  }
                }
              }
            }
          },
          "tags": [
            "task"
          ],
          "security": [
            {
              "rest-token": []
            }
          ]
        }
      },
      "/v2/task/{id}/move": {
        "post": {
          "operationId": "TaskController_move",
          "summary": "Move task to project/group",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/MoveTaskDto"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/TaskResponseDto"
                  }
                }
              }
            }
          },
          "tags": [
            "task"
          ],
          "security": [
            {
              "rest-token": []
            }
          ]
        }
      },
      "/v2/task/{id}/change-column": {
        "post": {
          "operationId": "TaskController_changeColumn",
          "summary": "Change task kanban column",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ChangeTaskColumnDto"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/TaskResponseDto"
                  }
                }
              }
            }
          },
          "tags": [
            "task"
          ],
          "security": [
            {
              "rest-token": []
            }
          ]
        }
      },
      "/v2/kanban-status": {
        "get": {
          "operationId": "KanbanStatusController_list",
          "summary": "Get list of kanban statuses",
          "parameters": [
            {
              "name": "maxCount",
              "required": false,
              "in": "query",
              "description": "Maximum count, integer 1–1000",
              "schema": {
                "maximum": 1000,
                "type": "number"
              }
            },
            {
              "name": "offset",
              "required": false,
              "in": "query",
              "description": "Offset for pagination, integer ≥ 0",
              "schema": {
                "minimum": 0,
                "type": "number"
              }
            },
            {
              "name": "modifiedSince",
              "required": false,
              "in": "query",
              "description": "Return entities modified since the given sync timestamp (full ISO datetime with time component, e.g. 2026-07-01T00:00:00.000Z). Offsets like +03:00 are accepted and normalized to UTC Z before comparison.",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "paginationData",
              "required": false,
              "in": "query",
              "description": "Include `pagination` block in response with `total/count/offset`. Default `false`.",
              "schema": {
                "default": false,
                "type": "boolean"
              }
            },
            {
              "name": "includeRemoved",
              "required": false,
              "in": "query",
              "description": "Include removed statuses",
              "example": false,
              "schema": {
                "default": false,
                "type": "boolean"
              }
            },
            {
              "name": "projectId",
              "required": false,
              "in": "query",
              "example": "P-123e4567-e89b-12d3-a456-426614174000",
              "description": "Shorthand for `projectId.eq` using operator `eq` (equal, =). Single scalar value.",
              "deprecated": false,
              "schema": {
                "type": "string",
                "pattern": "^(?:P)-",
                "format": "singularity-id"
              }
            },
            {
              "name": "fields",
              "required": false,
              "in": "query",
              "description": "Comma-separated sparse field list. Allowed fields: id, modificatedDate, name, projectId, kanbanOrder, numberOfColumns",
              "example": "id,modificatedDate,name",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "projectId.eq",
              "required": false,
              "in": "query",
              "deprecated": false,
              "description": "Filter by `projectId` using operator `eq` (equal, =). Single scalar value.",
              "example": "P-123e4567-e89b-12d3-a456-426614174000",
              "schema": {
                "type": "string",
                "pattern": "^(?:P)-",
                "format": "singularity-id"
              }
            },
            {
              "name": "projectId.ne",
              "required": false,
              "in": "query",
              "deprecated": false,
              "description": "Filter by `projectId` using operator `ne` (not equal or NULL, != / IS NULL). Single scalar value.",
              "example": "P-123e4567-e89b-12d3-a456-426614174000",
              "schema": {
                "type": "string",
                "pattern": "^(?:P)-",
                "format": "singularity-id"
              }
            },
            {
              "name": "projectId.in",
              "required": false,
              "in": "query",
              "deprecated": false,
              "description": "Filter by `projectId` using operator `in` (in list, IN). Comma-separated list of values.",
              "example": "P-123e4567-e89b-12d3-a456-426614174000,P-223e4567-e89b-12d3-a456-426614174000",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "projectId.isSet",
              "required": false,
              "in": "query",
              "deprecated": false,
              "description": "Filter by `projectId` using operator `isSet` (is set / is null). Boolean flag: `true` means `IS NOT NULL`, `false` means `IS NULL`.",
              "example": false,
              "schema": {
                "type": "boolean",
                "enum": [
                  true,
                  false
                ]
              }
            }
          ],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/KanbanStatusListResponseDto"
                  }
                }
              }
            }
          },
          "tags": [
            "kanban-status"
          ],
          "security": [
            {
              "rest-token": []
            }
          ]
        },
        "post": {
          "operationId": "KanbanStatusController_create",
          "summary": "Create kanban status",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/KanbanStatusCreateDto"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/KanbanStatusResponseDto"
                  }
                }
              }
            }
          },
          "tags": [
            "kanban-status"
          ],
          "security": [
            {
              "rest-token": []
            }
          ]
        }
      },
      "/v2/kanban-status/{id}": {
        "get": {
          "operationId": "KanbanStatusController_getById",
          "summary": "Get kanban status by ID",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "fields",
              "required": false,
              "in": "query",
              "description": "Comma-separated sparse field list. Allowed fields: id, modificatedDate, name, projectId, kanbanOrder, numberOfColumns",
              "example": "id,modificatedDate,name",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/KanbanStatusResponseDto"
                  }
                }
              }
            }
          },
          "tags": [
            "kanban-status"
          ],
          "security": [
            {
              "rest-token": []
            }
          ]
        },
        "patch": {
          "operationId": "KanbanStatusController_update",
          "summary": "Update kanban status",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/KanbanStatusUpdateDto"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/KanbanStatusResponseDto"
                  }
                }
              }
            }
          },
          "tags": [
            "kanban-status"
          ],
          "security": [
            {
              "rest-token": []
            }
          ]
        },
        "delete": {
          "operationId": "KanbanStatusController_delete",
          "summary": "Delete kanban status",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "204": {
              "description": ""
            }
          },
          "tags": [
            "kanban-status"
          ],
          "security": [
            {
              "rest-token": []
            }
          ]
        }
      },
      "/v2/kanban-task-status": {
        "get": {
          "operationId": "KanbanTaskStatusController_list",
          "summary": "Get list of task-kanban status links",
          "parameters": [
            {
              "name": "maxCount",
              "required": false,
              "in": "query",
              "description": "Maximum count, integer 1–1000",
              "schema": {
                "maximum": 1000,
                "type": "number"
              }
            },
            {
              "name": "offset",
              "required": false,
              "in": "query",
              "description": "Offset for pagination, integer ≥ 0",
              "schema": {
                "minimum": 0,
                "type": "number"
              }
            },
            {
              "name": "modifiedSince",
              "required": false,
              "in": "query",
              "description": "Return entities modified since the given sync timestamp (full ISO datetime with time component, e.g. 2026-07-01T00:00:00.000Z). Offsets like +03:00 are accepted and normalized to UTC Z before comparison.",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "paginationData",
              "required": false,
              "in": "query",
              "description": "Include `pagination` block in response with `total/count/offset`. Default `false`.",
              "schema": {
                "default": false,
                "type": "boolean"
              }
            },
            {
              "name": "includeRemoved",
              "required": false,
              "in": "query",
              "description": "Include removed links",
              "example": false,
              "schema": {
                "default": false,
                "type": "boolean"
              }
            },
            {
              "name": "taskId",
              "required": false,
              "in": "query",
              "example": "T-123e4567-e89b-12d3-a456-426614174000",
              "description": "Shorthand for `taskId.eq` using operator `eq` (equal, =). Single scalar value.",
              "deprecated": false,
              "schema": {
                "type": "string",
                "pattern": "^(?:T)-",
                "format": "singularity-id"
              }
            },
            {
              "name": "statusId",
              "required": false,
              "in": "query",
              "example": "KS-123e4567-e89b-12d3-a456-426614174000",
              "description": "Shorthand for `statusId.eq` using operator `eq` (equal, =). Single scalar value.",
              "deprecated": false,
              "schema": {
                "type": "string",
                "pattern": "^(?:KS)-",
                "format": "singularity-id"
              }
            },
            {
              "name": "fields",
              "required": false,
              "in": "query",
              "description": "Comma-separated sparse field list. Allowed fields: id, modificatedDate, taskId, statusId, kanbanOrder, modificated",
              "example": "id,modificatedDate,taskId",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "taskId.eq",
              "required": false,
              "in": "query",
              "deprecated": false,
              "description": "Filter by `taskId` using operator `eq` (equal, =). Single scalar value.",
              "example": "T-123e4567-e89b-12d3-a456-426614174000",
              "schema": {
                "type": "string",
                "pattern": "^(?:T)-",
                "format": "singularity-id"
              }
            },
            {
              "name": "taskId.in",
              "required": false,
              "in": "query",
              "deprecated": false,
              "description": "Filter by `taskId` using operator `in` (in list, IN). Comma-separated list of values.",
              "example": "T-123e4567-e89b-12d3-a456-426614174000,T-223e4567-e89b-12d3-a456-426614174000",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "statusId.eq",
              "required": false,
              "in": "query",
              "deprecated": false,
              "description": "Filter by `statusId` using operator `eq` (equal, =). Single scalar value.",
              "example": "KS-123e4567-e89b-12d3-a456-426614174000",
              "schema": {
                "type": "string",
                "pattern": "^(?:KS)-",
                "format": "singularity-id"
              }
            },
            {
              "name": "statusId.in",
              "required": false,
              "in": "query",
              "deprecated": false,
              "description": "Filter by `statusId` using operator `in` (in list, IN). Comma-separated list of values.",
              "example": "KS-123e4567-e89b-12d3-a456-426614174000,KS-223e4567-e89b-12d3-a456-426614174000",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/KanbanTaskStatusListResponseDto"
                  }
                }
              }
            }
          },
          "tags": [
            "kanban-task-status"
          ],
          "security": [
            {
              "rest-token": []
            }
          ]
        },
        "post": {
          "operationId": "KanbanTaskStatusController_create",
          "summary": "Create task-kanban status link",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/KanbanTaskStatusCreateDto"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/KanbanTaskStatusResponseDto"
                  }
                }
              }
            }
          },
          "tags": [
            "kanban-task-status"
          ],
          "security": [
            {
              "rest-token": []
            }
          ]
        }
      },
      "/v2/kanban-task-status/{id}": {
        "get": {
          "operationId": "KanbanTaskStatusController_getById",
          "summary": "Get task-kanban status link by ID",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "fields",
              "required": false,
              "in": "query",
              "description": "Comma-separated sparse field list. Allowed fields: id, modificatedDate, taskId, statusId, kanbanOrder, modificated",
              "example": "id,modificatedDate,taskId",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/KanbanTaskStatusResponseDto"
                  }
                }
              }
            }
          },
          "tags": [
            "kanban-task-status"
          ],
          "security": [
            {
              "rest-token": []
            }
          ]
        },
        "patch": {
          "operationId": "KanbanTaskStatusController_update",
          "summary": "Update task-kanban status link",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/KanbanTaskStatusUpdateDto"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/KanbanTaskStatusResponseDto"
                  }
                }
              }
            }
          },
          "tags": [
            "kanban-task-status"
          ],
          "security": [
            {
              "rest-token": []
            }
          ]
        },
        "delete": {
          "operationId": "KanbanTaskStatusController_delete",
          "summary": "Delete task-kanban status link",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "204": {
              "description": ""
            }
          },
          "tags": [
            "kanban-task-status"
          ],
          "security": [
            {
              "rest-token": []
            }
          ]
        }
      },
      "/v2/habit": {
        "get": {
          "operationId": "HabitController_list",
          "summary": "Get list of habits",
          "parameters": [
            {
              "name": "maxCount",
              "required": false,
              "in": "query",
              "description": "Maximum count, integer 1–1000",
              "schema": {
                "maximum": 1000,
                "type": "number"
              }
            },
            {
              "name": "offset",
              "required": false,
              "in": "query",
              "description": "Offset for pagination, integer ≥ 0",
              "schema": {
                "minimum": 0,
                "type": "number"
              }
            },
            {
              "name": "modifiedSince",
              "required": false,
              "in": "query",
              "description": "Return entities modified since the given sync timestamp (full ISO datetime with time component, e.g. 2026-07-01T00:00:00.000Z). Offsets like +03:00 are accepted and normalized to UTC Z before comparison.",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "paginationData",
              "required": false,
              "in": "query",
              "description": "Include `pagination` block in response with `total/count/offset`. Default `false`.",
              "schema": {
                "default": false,
                "type": "boolean"
              }
            },
            {
              "name": "includeArchived",
              "required": false,
              "in": "query",
              "description": "Include archived habits",
              "schema": {
                "default": false,
                "type": "boolean"
              }
            },
            {
              "name": "status",
              "required": false,
              "in": "query",
              "description": "Shorthand for `status.eq` using operator `eq` (equal, =). Single scalar value.",
              "deprecated": false,
              "example": 1,
              "schema": {
                "type": "number"
              }
            },
            {
              "name": "fields",
              "required": false,
              "in": "query",
              "description": "Comma-separated sparse field list. Allowed fields: id, title, description, color, order, status, modificatedDate, externalId",
              "example": "id,title,description",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "status.eq",
              "required": false,
              "in": "query",
              "deprecated": false,
              "description": "Filter by `status` using operator `eq` (equal, =). Single scalar value.",
              "example": 1,
              "schema": {
                "type": "number"
              }
            },
            {
              "name": "status.ne",
              "required": false,
              "in": "query",
              "deprecated": false,
              "description": "Filter by `status` using operator `ne` (not equal or NULL, != / IS NULL). Single scalar value.",
              "example": 1,
              "schema": {
                "type": "number"
              }
            },
            {
              "name": "status.in",
              "required": false,
              "in": "query",
              "deprecated": false,
              "description": "Filter by `status` using operator `in` (in list, IN). Comma-separated list of values.",
              "example": 1,
              "schema": {
                "type": "number"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/HabitListResponseDto"
                  }
                }
              }
            }
          },
          "tags": [
            "habit"
          ],
          "security": [
            {
              "rest-token": []
            }
          ]
        },
        "post": {
          "operationId": "HabitController_create",
          "summary": "Create habit",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/HabitCreateDto"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/HabitResponseDto"
                  }
                }
              }
            }
          },
          "tags": [
            "habit"
          ],
          "security": [
            {
              "rest-token": []
            }
          ]
        }
      },
      "/v2/habit/{id}": {
        "get": {
          "operationId": "HabitController_getById",
          "summary": "Get habit by ID",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "fields",
              "required": false,
              "in": "query",
              "description": "Comma-separated sparse field list. Allowed fields: id, title, description, color, order, status, modificatedDate, externalId",
              "example": "id,title,description",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/HabitResponseDto"
                  }
                }
              }
            }
          },
          "tags": [
            "habit"
          ],
          "security": [
            {
              "rest-token": []
            }
          ]
        },
        "patch": {
          "operationId": "HabitController_update",
          "summary": "Update habit",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/HabitUpdateDto"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/HabitResponseDto"
                  }
                }
              }
            }
          },
          "tags": [
            "habit"
          ],
          "security": [
            {
              "rest-token": []
            }
          ]
        },
        "delete": {
          "operationId": "HabitController_delete",
          "summary": "Delete habit",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "204": {
              "description": ""
            }
          },
          "tags": [
            "habit"
          ],
          "security": [
            {
              "rest-token": []
            }
          ]
        }
      },
      "/v2/habit-progress": {
        "get": {
          "operationId": "HabitDailyProgressController_list",
          "summary": "Get list of habit progress records",
          "parameters": [
            {
              "name": "maxCount",
              "required": false,
              "in": "query",
              "description": "Maximum count, integer 1–1000",
              "schema": {
                "maximum": 1000,
                "type": "number"
              }
            },
            {
              "name": "offset",
              "required": false,
              "in": "query",
              "description": "Offset for pagination, integer ≥ 0",
              "schema": {
                "minimum": 0,
                "type": "number"
              }
            },
            {
              "name": "modifiedSince",
              "required": false,
              "in": "query",
              "description": "Return entities modified since the given sync timestamp (full ISO datetime with time component, e.g. 2026-07-01T00:00:00.000Z). Offsets like +03:00 are accepted and normalized to UTC Z before comparison.",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "paginationData",
              "required": false,
              "in": "query",
              "description": "Include `pagination` block in response with `total/count/offset`. Default `false`.",
              "schema": {
                "default": false,
                "type": "boolean"
              }
            },
            {
              "name": "habit",
              "required": false,
              "in": "query",
              "example": "HB-123e4567-e89b-12d3-a456-426614174000",
              "description": "Shorthand for `habit.eq` using operator `eq` (equal, =). Single scalar value.",
              "deprecated": false,
              "schema": {
                "type": "string",
                "pattern": "^(?:HB)-",
                "format": "singularity-id"
              }
            },
            {
              "name": "date",
              "required": false,
              "in": "query",
              "description": "Shorthand for `date.eq` using operator `eq` (equal, =). Date-only value in YYYY-MM-DD format.",
              "deprecated": false,
              "example": "2026-05-01",
              "schema": {
                "type": "string",
                "pattern": "^\\d{4}-\\d{2}-\\d{2}$"
              }
            },
            {
              "name": "fields",
              "required": false,
              "in": "query",
              "description": "Comma-separated sparse field list. Allowed fields: id, habit, date, progress, modificatedDate",
              "example": "id,habit,date",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "habit.eq",
              "required": false,
              "in": "query",
              "deprecated": false,
              "description": "Filter by `habit` using operator `eq` (equal, =). Single scalar value.",
              "example": "HB-123e4567-e89b-12d3-a456-426614174000",
              "schema": {
                "type": "string",
                "pattern": "^(?:HB)-",
                "format": "singularity-id"
              }
            },
            {
              "name": "habit.in",
              "required": false,
              "in": "query",
              "deprecated": false,
              "description": "Filter by `habit` using operator `in` (in list, IN). Comma-separated list of values.",
              "example": "HB-123e4567-e89b-12d3-a456-426614174000,HB-223e4567-e89b-12d3-a456-426614174000",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "date.eq",
              "required": false,
              "in": "query",
              "deprecated": false,
              "description": "Filter by `date` using operator `eq` (equal, =). Date-only value in YYYY-MM-DD format.",
              "example": "2026-05-01",
              "schema": {
                "type": "string",
                "pattern": "^\\d{4}-\\d{2}-\\d{2}$"
              }
            },
            {
              "name": "date.gt",
              "required": false,
              "in": "query",
              "deprecated": false,
              "description": "Filter by `date` using operator `gt` (greater than, >). Date-only value in YYYY-MM-DD format.",
              "example": "2026-05-01",
              "schema": {
                "type": "string",
                "pattern": "^\\d{4}-\\d{2}-\\d{2}$"
              }
            },
            {
              "name": "date.gte",
              "required": false,
              "in": "query",
              "deprecated": false,
              "description": "Filter by `date` using operator `gte` (greater than or equal, >=). Date-only value in YYYY-MM-DD format.",
              "example": "2026-05-01",
              "schema": {
                "type": "string",
                "pattern": "^\\d{4}-\\d{2}-\\d{2}$"
              }
            },
            {
              "name": "date.lt",
              "required": false,
              "in": "query",
              "deprecated": false,
              "description": "Filter by `date` using operator `lt` (less than, <). Date-only value in YYYY-MM-DD format.",
              "example": "2026-05-01",
              "schema": {
                "type": "string",
                "pattern": "^\\d{4}-\\d{2}-\\d{2}$"
              }
            },
            {
              "name": "date.lte",
              "required": false,
              "in": "query",
              "deprecated": false,
              "description": "Filter by `date` using operator `lte` (less than or equal, <=). Date-only value in YYYY-MM-DD format.",
              "example": "2026-05-01",
              "schema": {
                "type": "string",
                "pattern": "^\\d{4}-\\d{2}-\\d{2}$"
              }
            },
            {
              "name": "date.isSet",
              "required": false,
              "in": "query",
              "deprecated": false,
              "description": "Filter by `date` using operator `isSet` (is set / is null). Boolean flag: `true` means `IS NOT NULL`, `false` means `IS NULL`.",
              "example": false,
              "schema": {
                "type": "boolean",
                "enum": [
                  true,
                  false
                ]
              }
            },
            {
              "name": "startDate",
              "required": false,
              "in": "query",
              "deprecated": true,
              "description": "Deprecated alias for `date.gte` using operator `gte` (greater than or equal, >=). Date-only value in YYYY-MM-DD format.",
              "example": "2026-05-01",
              "schema": {
                "type": "string",
                "pattern": "^\\d{4}-\\d{2}-\\d{2}$"
              }
            },
            {
              "name": "endDate",
              "required": false,
              "in": "query",
              "deprecated": true,
              "description": "Deprecated alias for `date.lte` using operator `lte` (less than or equal, <=). Date-only value in YYYY-MM-DD format.",
              "example": "2026-05-01",
              "schema": {
                "type": "string",
                "pattern": "^\\d{4}-\\d{2}-\\d{2}$"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/HabitDailyProgressListResponseDto"
                  }
                }
              }
            }
          },
          "tags": [
            "habit-progress"
          ],
          "security": [
            {
              "rest-token": []
            }
          ]
        },
        "post": {
          "operationId": "HabitDailyProgressController_create",
          "summary": "Create habit progress record",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/HabitDailyProgressCreateDto"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/HabitDailyProgressResponseDto"
                  }
                }
              }
            }
          },
          "tags": [
            "habit-progress"
          ],
          "security": [
            {
              "rest-token": []
            }
          ]
        }
      },
      "/v2/habit-progress/{id}": {
        "get": {
          "operationId": "HabitDailyProgressController_getById",
          "summary": "Get habit progress record by ID",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "fields",
              "required": false,
              "in": "query",
              "description": "Comma-separated sparse field list. Allowed fields: id, habit, date, progress, modificatedDate",
              "example": "id,habit,date",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/HabitDailyProgressResponseDto"
                  }
                }
              }
            }
          },
          "tags": [
            "habit-progress"
          ],
          "security": [
            {
              "rest-token": []
            }
          ]
        },
        "patch": {
          "operationId": "HabitDailyProgressController_update",
          "summary": "Update habit progress record",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/HabitDailyProgressUpdateDto"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/HabitDailyProgressResponseDto"
                  }
                }
              }
            }
          },
          "tags": [
            "habit-progress"
          ],
          "security": [
            {
              "rest-token": []
            }
          ]
        },
        "delete": {
          "operationId": "HabitDailyProgressController_delete",
          "summary": "Delete habit progress record",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "204": {
              "description": ""
            }
          },
          "tags": [
            "habit-progress"
          ],
          "security": [
            {
              "rest-token": []
            }
          ]
        }
      },
      "/v2/checklist-item": {
        "get": {
          "operationId": "ChecklistItemController_list",
          "summary": "Get checklist items list",
          "parameters": [
            {
              "name": "maxCount",
              "required": false,
              "in": "query",
              "description": "Maximum count, integer 1–1000",
              "schema": {
                "maximum": 1000,
                "type": "number"
              }
            },
            {
              "name": "offset",
              "required": false,
              "in": "query",
              "description": "Offset for pagination, integer ≥ 0",
              "schema": {
                "minimum": 0,
                "type": "number"
              }
            },
            {
              "name": "modifiedSince",
              "required": false,
              "in": "query",
              "description": "Return entities modified since the given sync timestamp (full ISO datetime with time component, e.g. 2026-07-01T00:00:00.000Z). Offsets like +03:00 are accepted and normalized to UTC Z before comparison.",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "paginationData",
              "required": false,
              "in": "query",
              "description": "Include `pagination` block in response with `total/count/offset`. Default `false`.",
              "schema": {
                "default": false,
                "type": "boolean"
              }
            },
            {
              "name": "includeRemoved",
              "required": false,
              "in": "query",
              "description": "Include removed items",
              "schema": {
                "default": false,
                "type": "boolean"
              }
            },
            {
              "name": "parent",
              "required": false,
              "in": "query",
              "example": "T-123e4567-e89b-12d3-a456-426614174000",
              "description": "Shorthand for `parent.eq` using operator `eq` (equal, =). Single scalar value.",
              "deprecated": false,
              "schema": {
                "type": "string",
                "pattern": "^(?:T)-",
                "format": "singularity-id"
              }
            },
            {
              "name": "fields",
              "required": false,
              "in": "query",
              "description": "Comma-separated sparse field list. Allowed fields: id, modificatedDate, parent, parentOrder, title, done, crypted",
              "example": "id,modificatedDate,parent",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "parent.eq",
              "required": false,
              "in": "query",
              "deprecated": false,
              "description": "Filter by `parent` using operator `eq` (equal, =). Single scalar value.",
              "example": "T-123e4567-e89b-12d3-a456-426614174000",
              "schema": {
                "type": "string",
                "pattern": "^(?:T)-",
                "format": "singularity-id"
              }
            },
            {
              "name": "parent.ne",
              "required": false,
              "in": "query",
              "deprecated": false,
              "description": "Filter by `parent` using operator `ne` (not equal or NULL, != / IS NULL). Single scalar value.",
              "example": "T-123e4567-e89b-12d3-a456-426614174000",
              "schema": {
                "type": "string",
                "pattern": "^(?:T)-",
                "format": "singularity-id"
              }
            },
            {
              "name": "parent.in",
              "required": false,
              "in": "query",
              "deprecated": false,
              "description": "Filter by `parent` using operator `in` (in list, IN). Comma-separated list of values.",
              "example": "T-123e4567-e89b-12d3-a456-426614174000,T-223e4567-e89b-12d3-a456-426614174000",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "parent.isSet",
              "required": false,
              "in": "query",
              "deprecated": false,
              "description": "Filter by `parent` using operator `isSet` (is set / is null). Boolean flag: `true` means `IS NOT NULL`, `false` means `IS NULL`.",
              "example": false,
              "schema": {
                "type": "boolean",
                "enum": [
                  true,
                  false
                ]
              }
            }
          ],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/ChecklistItemListResponseDto"
                  }
                }
              }
            }
          },
          "tags": [
            "checklist-item"
          ],
          "security": [
            {
              "rest-token": []
            }
          ]
        },
        "post": {
          "operationId": "ChecklistItemController_create",
          "summary": "Create checklist item",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ChecklistItemCreateDto"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/ChecklistItemResponseDto"
                  }
                }
              }
            }
          },
          "tags": [
            "checklist-item"
          ],
          "security": [
            {
              "rest-token": []
            }
          ]
        }
      },
      "/v2/checklist-item/{id}": {
        "get": {
          "operationId": "ChecklistItemController_getById",
          "summary": "Get checklist item by ID",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "fields",
              "required": false,
              "in": "query",
              "description": "Comma-separated sparse field list. Allowed fields: id, modificatedDate, parent, parentOrder, title, done, crypted",
              "example": "id,modificatedDate,parent",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/ChecklistItemResponseDto"
                  }
                }
              }
            }
          },
          "tags": [
            "checklist-item"
          ],
          "security": [
            {
              "rest-token": []
            }
          ]
        },
        "patch": {
          "operationId": "ChecklistItemController_update",
          "summary": "Update checklist item",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ChecklistItemUpdateDto"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/ChecklistItemResponseDto"
                  }
                }
              }
            }
          },
          "tags": [
            "checklist-item"
          ],
          "security": [
            {
              "rest-token": []
            }
          ]
        },
        "delete": {
          "operationId": "ChecklistItemController_delete",
          "summary": "Delete checklist item",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "204": {
              "description": ""
            }
          },
          "tags": [
            "checklist-item"
          ],
          "security": [
            {
              "rest-token": []
            }
          ]
        }
      },
      "/v2/checklist-item/{id}/check": {
        "post": {
          "operationId": "ChecklistItemController_check",
          "summary": "Check checklist item",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/ChecklistItemResponseDto"
                  }
                }
              }
            }
          },
          "tags": [
            "checklist-item"
          ],
          "security": [
            {
              "rest-token": []
            }
          ]
        }
      },
      "/v2/checklist-item/{id}/uncheck": {
        "post": {
          "operationId": "ChecklistItemController_uncheck",
          "summary": "Uncheck checklist item",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/ChecklistItemResponseDto"
                  }
                }
              }
            }
          },
          "tags": [
            "checklist-item"
          ],
          "security": [
            {
              "rest-token": []
            }
          ]
        }
      },
      "/v2/tag": {
        "get": {
          "operationId": "TagController_list",
          "summary": "Get list of tags",
          "parameters": [
            {
              "name": "maxCount",
              "required": false,
              "in": "query",
              "description": "Maximum count, integer 1–1000",
              "schema": {
                "maximum": 1000,
                "type": "number"
              }
            },
            {
              "name": "offset",
              "required": false,
              "in": "query",
              "description": "Offset for pagination, integer ≥ 0",
              "schema": {
                "minimum": 0,
                "type": "number"
              }
            },
            {
              "name": "modifiedSince",
              "required": false,
              "in": "query",
              "description": "Return entities modified since the given sync timestamp (full ISO datetime with time component, e.g. 2026-07-01T00:00:00.000Z). Offsets like +03:00 are accepted and normalized to UTC Z before comparison.",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "paginationData",
              "required": false,
              "in": "query",
              "description": "Include `pagination` block in response with `total/count/offset`. Default `false`.",
              "schema": {
                "default": false,
                "type": "boolean"
              }
            },
            {
              "name": "includeRemoved",
              "required": false,
              "in": "query",
              "description": "Include removed tags",
              "schema": {
                "default": false,
                "type": "boolean"
              }
            },
            {
              "name": "parent",
              "required": false,
              "in": "query",
              "example": "A-123e4567-e89b-12d3-a456-426614174000",
              "description": "Shorthand for `parent.eq` using operator `eq` (equal, =). Single scalar value.",
              "deprecated": false,
              "schema": {
                "type": "string",
                "pattern": "^(?:A)-",
                "format": "singularity-id"
              }
            },
            {
              "name": "fields",
              "required": false,
              "in": "query",
              "description": "Comma-separated sparse field list. Allowed fields: id, title, externalId, hotkey, parent, parentOrder, modificatedDate, color",
              "example": "id,title,externalId",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "parent.eq",
              "required": false,
              "in": "query",
              "deprecated": false,
              "description": "Filter by `parent` using operator `eq` (equal, =). Single scalar value.",
              "example": "A-123e4567-e89b-12d3-a456-426614174000",
              "schema": {
                "type": "string",
                "pattern": "^(?:A)-",
                "format": "singularity-id"
              }
            },
            {
              "name": "parent.ne",
              "required": false,
              "in": "query",
              "deprecated": false,
              "description": "Filter by `parent` using operator `ne` (not equal or NULL, != / IS NULL). Single scalar value.",
              "example": "A-123e4567-e89b-12d3-a456-426614174000",
              "schema": {
                "type": "string",
                "pattern": "^(?:A)-",
                "format": "singularity-id"
              }
            },
            {
              "name": "parent.in",
              "required": false,
              "in": "query",
              "deprecated": false,
              "description": "Filter by `parent` using operator `in` (in list, IN). Comma-separated list of values.",
              "example": "A-123e4567-e89b-12d3-a456-426614174000,A-223e4567-e89b-12d3-a456-426614174000",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "parent.isSet",
              "required": false,
              "in": "query",
              "deprecated": false,
              "description": "Filter by `parent` using operator `isSet` (is set / is null). Boolean flag: `true` means `IS NOT NULL`, `false` means `IS NULL`.",
              "example": false,
              "schema": {
                "type": "boolean",
                "enum": [
                  true,
                  false
                ]
              }
            }
          ],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/TagListResponseDto"
                  }
                }
              }
            }
          },
          "tags": [
            "tag"
          ],
          "security": [
            {
              "rest-token": []
            }
          ]
        },
        "post": {
          "operationId": "TagController_create",
          "summary": "Create tag",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/TagCreateDto"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/TagResponseDto"
                  }
                }
              }
            }
          },
          "tags": [
            "tag"
          ],
          "security": [
            {
              "rest-token": []
            }
          ]
        }
      },
      "/v2/tag/{id}": {
        "get": {
          "operationId": "TagController_getById",
          "summary": "Get tag by ID",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "fields",
              "required": false,
              "in": "query",
              "description": "Comma-separated sparse field list. Allowed fields: id, title, externalId, hotkey, parent, parentOrder, modificatedDate, color",
              "example": "id,title,externalId",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/TagResponseDto"
                  }
                }
              }
            }
          },
          "tags": [
            "tag"
          ],
          "security": [
            {
              "rest-token": []
            }
          ]
        },
        "patch": {
          "operationId": "TagController_update",
          "summary": "Update tag",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/TagUpdateDto"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/TagResponseDto"
                  }
                }
              }
            }
          },
          "tags": [
            "tag"
          ],
          "security": [
            {
              "rest-token": []
            }
          ]
        },
        "delete": {
          "operationId": "TagController_delete",
          "summary": "Delete tag",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "204": {
              "description": ""
            }
          },
          "tags": [
            "tag"
          ],
          "security": [
            {
              "rest-token": []
            }
          ]
        }
      },
      "/v2/time-stat": {
        "get": {
          "operationId": "TimeStatController_list",
          "summary": "Get list of time stats",
          "parameters": [
            {
              "name": "maxCount",
              "required": false,
              "in": "query",
              "description": "Maximum count, integer 1–1000",
              "schema": {
                "maximum": 1000,
                "type": "number"
              }
            },
            {
              "name": "offset",
              "required": false,
              "in": "query",
              "description": "Offset for pagination, integer ≥ 0",
              "schema": {
                "minimum": 0,
                "type": "number"
              }
            },
            {
              "name": "modifiedSince",
              "required": false,
              "in": "query",
              "description": "Return entities modified since the given sync timestamp (full ISO datetime with time component, e.g. 2026-07-01T00:00:00.000Z). Offsets like +03:00 are accepted and normalized to UTC Z before comparison.",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "paginationData",
              "required": false,
              "in": "query",
              "description": "Include `pagination` block in response with `total/count/offset`. Default `false`.",
              "schema": {
                "default": false,
                "type": "boolean"
              }
            },
            {
              "name": "date",
              "required": false,
              "in": "query",
              "description": "Shorthand for `date.eq` using operator `eq` (equal, =). ISO 8601 date-time or date-only value.",
              "deprecated": false,
              "example": "2026-05-01T00:00:00.000Z",
              "schema": {
                "type": "string",
                "format": "date-time"
              }
            },
            {
              "name": "relatedTaskId",
              "required": false,
              "in": "query",
              "example": "T-123e4567-e89b-12d3-a456-426614174000",
              "description": "Shorthand for `relatedTaskId.eq` using operator `eq` (equal, =). Single scalar value.",
              "deprecated": false,
              "schema": {
                "type": "string",
                "pattern": "^(?:T)-",
                "format": "singularity-id"
              }
            },
            {
              "name": "fields",
              "required": false,
              "in": "query",
              "description": "Comma-separated sparse field list. Allowed fields: id, start, end, secondsPassed, quantity, relatedTaskId, outdated, source, modificatedDate",
              "example": "id,start,end",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "date.eq",
              "required": false,
              "in": "query",
              "deprecated": false,
              "description": "Filter by `date` using operator `eq` (equal, =). ISO 8601 date-time or date-only value.",
              "example": "2026-05-01T00:00:00.000Z",
              "schema": {
                "type": "string",
                "format": "date-time"
              }
            },
            {
              "name": "date.gt",
              "required": false,
              "in": "query",
              "deprecated": false,
              "description": "Filter by `date` using operator `gt` (greater than, >). ISO 8601 date-time or date-only value.",
              "example": "2026-05-01T00:00:00.000Z",
              "schema": {
                "type": "string",
                "format": "date-time"
              }
            },
            {
              "name": "date.gte",
              "required": false,
              "in": "query",
              "deprecated": false,
              "description": "Filter by `date` using operator `gte` (greater than or equal, >=). ISO 8601 date-time or date-only value.",
              "example": "2026-05-01T00:00:00.000Z",
              "schema": {
                "type": "string",
                "format": "date-time"
              }
            },
            {
              "name": "date.lt",
              "required": false,
              "in": "query",
              "deprecated": false,
              "description": "Filter by `date` using operator `lt` (less than, <). ISO 8601 date-time or date-only value.",
              "example": "2026-05-01T00:00:00.000Z",
              "schema": {
                "type": "string",
                "format": "date-time"
              }
            },
            {
              "name": "date.lte",
              "required": false,
              "in": "query",
              "deprecated": false,
              "description": "Filter by `date` using operator `lte` (less than or equal, <=). ISO 8601 date-time or date-only value.",
              "example": "2026-05-01T00:00:00.000Z",
              "schema": {
                "type": "string",
                "format": "date-time"
              }
            },
            {
              "name": "date.isSet",
              "required": false,
              "in": "query",
              "deprecated": false,
              "description": "Filter by `date` using operator `isSet` (is set / is null). Boolean flag: `true` means `IS NOT NULL`, `false` means `IS NULL`.",
              "example": false,
              "schema": {
                "type": "boolean",
                "enum": [
                  true,
                  false
                ]
              }
            },
            {
              "name": "dateFrom",
              "required": false,
              "in": "query",
              "deprecated": true,
              "description": "Deprecated alias for `date.gte` using operator `gte` (greater than or equal, >=). ISO 8601 date-time or date-only value.",
              "example": "2026-05-01T00:00:00.000Z",
              "schema": {
                "type": "string",
                "format": "date-time"
              }
            },
            {
              "name": "dateTo",
              "required": false,
              "in": "query",
              "deprecated": true,
              "description": "Deprecated alias for `date.lte` using operator `lte` (less than or equal, <=). ISO 8601 date-time or date-only value.",
              "example": "2026-05-01T00:00:00.000Z",
              "schema": {
                "type": "string",
                "format": "date-time"
              }
            },
            {
              "name": "relatedTaskId.eq",
              "required": false,
              "in": "query",
              "deprecated": false,
              "description": "Filter by `relatedTaskId` using operator `eq` (equal, =). Single scalar value.",
              "example": "T-123e4567-e89b-12d3-a456-426614174000",
              "schema": {
                "type": "string",
                "pattern": "^(?:T)-",
                "format": "singularity-id"
              }
            },
            {
              "name": "relatedTaskId.in",
              "required": false,
              "in": "query",
              "deprecated": false,
              "description": "Filter by `relatedTaskId` using operator `in` (in list, IN). Comma-separated list of values.",
              "example": "T-123e4567-e89b-12d3-a456-426614174000,T-223e4567-e89b-12d3-a456-426614174000",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/TimeStatListResponseDto"
                  }
                }
              }
            }
          },
          "tags": [
            "time-stat"
          ],
          "security": [
            {
              "rest-token": []
            }
          ]
        },
        "post": {
          "operationId": "TimeStatController_create",
          "summary": "Create time stat",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/TimeStatCreateDto"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/TimeStatResponseDto"
                  }
                }
              }
            }
          },
          "tags": [
            "time-stat"
          ],
          "security": [
            {
              "rest-token": []
            }
          ]
        },
        "delete": {
          "operationId": "TimeStatController_deleteBulk",
          "summary": "Bulk delete time stats by filters",
          "parameters": [
            {
              "name": "dateFrom",
              "required": false,
              "in": "query",
              "description": "Filter by start date (from), ISO 8601 date string or YYYY-MM-DD",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "dateTo",
              "required": false,
              "in": "query",
              "description": "Filter by start date (to), ISO 8601 date string or YYYY-MM-DD",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "relatedTaskId",
              "required": false,
              "in": "query",
              "example": "T-123e4567-e89b-12d3-a456-426614174000",
              "description": "Filter by related task ID, must start with T- (e.g. T-abc-123)",
              "schema": {
                "format": "singularity-id",
                "pattern": "^(?:T)-",
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/TimeStatDeleteBulkResponseDto"
                  }
                }
              }
            }
          },
          "tags": [
            "time-stat"
          ],
          "security": [
            {
              "rest-token": []
            }
          ]
        }
      },
      "/v2/time-stat/{id}": {
        "get": {
          "operationId": "TimeStatController_getById",
          "summary": "Get time stat by ID",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "fields",
              "required": false,
              "in": "query",
              "description": "Comma-separated sparse field list. Allowed fields: id, start, end, secondsPassed, quantity, relatedTaskId, outdated, source, modificatedDate",
              "example": "id,start,end",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/TimeStatResponseDto"
                  }
                }
              }
            }
          },
          "tags": [
            "time-stat"
          ],
          "security": [
            {
              "rest-token": []
            }
          ]
        },
        "patch": {
          "operationId": "TimeStatController_update",
          "summary": "Update time stat",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/TimeStatUpdateDto"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/TimeStatResponseDto"
                  }
                }
              }
            }
          },
          "tags": [
            "time-stat"
          ],
          "security": [
            {
              "rest-token": []
            }
          ]
        },
        "delete": {
          "operationId": "TimeStatController_delete",
          "summary": "Delete time stat",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "204": {
              "description": ""
            }
          },
          "tags": [
            "time-stat"
          ],
          "security": [
            {
              "rest-token": []
            }
          ]
        }
      },
      "/v2/batch": {
        "post": {
          "operationId": "BatchController_execute",
          "summary": "Execute batch of public REST operations",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/BatchRequestDto"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/BatchResponseDto"
                  }
                }
              }
            }
          },
          "tags": [
            "batch"
          ],
          "security": [
            {
              "rest-token": []
            }
          ]
        }
      }
    },
    "info": {
      "title": "Singularity",
      "description": "REST API",
      "version": "2.0",
      "contact": {}
    },
    "tags": [
      {
        "name": "v2",
        "description": ""
      }
    ],
    "servers": [],
    "components": {
      "securitySchemes": {
        "rest-token": {
          "type": "http",
          "scheme": "bearer",
          "bearerFormat": "token"
        }
      },
      "schemas": {
        "AuthenticateRequest": {
          "type": "object",
          "properties": {}
        },
        "AccountStatusRequest": {
          "type": "object",
          "properties": {}
        },
        "JwtRequest": {
          "type": "object",
          "properties": {}
        },
        "AuthExternalRequest": {
          "type": "object",
          "properties": {}
        },
        "ProjectListDto": {
          "type": "object",
          "properties": {
            "maxCount": {
              "type": "number",
              "description": "Maximum count, integer 1–1000",
              "maximum": 1000
            },
            "offset": {
              "type": "number",
              "description": "Offset for pagination, integer ≥ 0",
              "minimum": 0
            },
            "modifiedSince": {
              "type": "string",
              "description": "Return entities modified since the given sync timestamp (full ISO datetime with time component, e.g. 2026-07-01T00:00:00.000Z). Offsets like +03:00 are accepted and normalized to UTC Z before comparison."
            },
            "paginationData": {
              "type": "boolean",
              "description": "Include `pagination` block in response with `total/count/offset`. Default `false`.",
              "default": false
            },
            "includeRemoved": {
              "type": "boolean",
              "description": "Include removed projects",
              "default": false
            },
            "includeArchived": {
              "type": "boolean",
              "description": "Include archived projects",
              "default": false
            },
            "parent": {
              "type": "string",
              "pattern": "^(?:P)-",
              "format": "singularity-id",
              "example": "P-123e4567-e89b-12d3-a456-426614174000",
              "description": "Filter by parent project ID, must start with P-"
            },
            "journalDate": {
              "type": "string",
              "description": "Filter by date of project archivation"
            },
            "deleteDate": {
              "type": "string",
              "description": "Filter by delete date"
            },
            "isNotebook": {
              "type": "boolean",
              "description": "Filter by notebook flag"
            }
          }
        },
        "PaginationResponseDto": {
          "type": "object",
          "properties": {
            "total": {
              "type": "number",
              "description": "Total number of entities matching current filters",
              "minimum": 0
            },
            "count": {
              "type": "number",
              "description": "Number of entities returned in current response",
              "minimum": 0
            },
            "offset": {
              "type": "number",
              "description": "Current pagination offset",
              "minimum": 0
            }
          },
          "required": [
            "total",
            "count",
            "offset"
          ]
        },
        "ProjectResponseDto": {
          "type": "object",
          "properties": {
            "id": {
              "type": "string",
              "description": "Project identifier"
            },
            "title": {
              "type": "string",
              "description": "Project title"
            },
            "note": {
              "type": "string",
              "description": "Project note"
            },
            "start": {
              "type": "string",
              "description": "Start date"
            },
            "end": {
              "type": "string",
              "description": "End date"
            },
            "deleteDate": {
              "type": "string",
              "description": "Delete date"
            },
            "showInBasket": {
              "type": "boolean",
              "description": "Show in basket"
            },
            "emoji": {
              "type": "string",
              "description": "Emoji"
            },
            "color": {
              "type": "string",
              "description": "Color"
            },
            "externalId": {
              "type": "string",
              "description": "External ID"
            },
            "modificatedDate": {
              "type": "string",
              "description": "Modification date"
            },
            "reviewValidationDate": {
              "type": "string",
              "description": "Review date"
            },
            "reviewValidationInterval": {
              "type": "number",
              "description": "Review interval"
            },
            "parent": {
              "type": "string",
              "description": "Parent"
            },
            "parentOrder": {
              "type": "number",
              "description": "Parent order"
            },
            "journalDate": {
              "type": "string",
              "description": "Archivation date"
            },
            "sharedState": {
              "type": "object",
              "description": "SharedState"
            },
            "isNotebook": {
              "type": "boolean",
              "description": "Notebook"
            },
            "tags": {
              "description": "Tags",
              "type": "array",
              "items": {
                "type": "string"
              }
            },
            "modificated": {
              "type": "object",
              "description": "Modifications"
            }
          },
          "required": [
            "id",
            "title"
          ]
        },
        "ProjectListResponseDto": {
          "type": "object",
          "properties": {
            "pagination": {
              "description": "Pagination metadata",
              "allOf": [
                {
                  "$ref": "#/components/schemas/PaginationResponseDto"
                }
              ]
            },
            "projects": {
              "description": "List of projects",
              "type": "array",
              "items": {
                "$ref": "#/components/schemas/ProjectResponseDto"
              }
            }
          },
          "required": [
            "projects"
          ]
        },
        "ProjectCreateDto": {
          "type": "object",
          "properties": {
            "title": {
              "type": "string",
              "description": "Project title"
            },
            "note": {
              "type": "string",
              "description": "Project note in delta format"
            },
            "start": {
              "type": "string",
              "description": "Planned project start date, ISO 8601 date string"
            },
            "end": {
              "type": "string",
              "description": "Planned project end date, ISO 8601 date string"
            },
            "deleteDate": {
              "type": "string",
              "description": "Deletion date, ISO 8601 date string"
            },
            "journalDate": {
              "type": "string",
              "description": "Archivation date, ISO 8601 date string. Fill only is you want to archivate project!"
            },
            "showInBasket": {
              "type": "boolean",
              "description": "Show in basket"
            },
            "emoji": {
              "type": "string",
              "description": "Emoji"
            },
            "color": {
              "type": "string",
              "description": "Color, valid hex color (e.g. #FF0000)"
            },
            "externalId": {
              "type": "string",
              "description": "External system identifier"
            },
            "reviewValidationDate": {
              "type": "string",
              "description": "Review validation date, ISO 8601 date string"
            },
            "reviewValidationInterval": {
              "type": "number",
              "description": "Review validation interval as an integer: -1 = DEF (default), 0 = NEVER, 1 = ONEWEEK, 2 = TWOWEEKS, 3 = ONEMONTH, 4 = SIXMONTH. Send the number, not the name.",
              "enum": [
                0,
                1,
                2,
                3,
                4,
                -1
              ],
              "example": -1
            },
            "parent": {
              "type": "string",
              "pattern": "^(?:P)-",
              "format": "singularity-id",
              "example": "P-123e4567-e89b-12d3-a456-426614174000",
              "description": "Parent project ID, must start with P- (e.g. P-abc-123)"
            },
            "parentOrder": {
              "type": "number",
              "description": "Order in parent project"
            },
            "isNotebook": {
              "type": "boolean",
              "description": "Is notebook project"
            }
          },
          "required": [
            "title"
          ]
        },
        "TaskGroupResponseDto": {
          "type": "object",
          "properties": {
            "id": {
              "type": "string",
              "description": "Task group identifier in Q-uuid format",
              "example": "Q-9f1b1c3e-8b9a-4c17-9de0-83c6a9d9cba1"
            },
            "title": {
              "type": "string",
              "description": "Task group title",
              "example": "Important tasks"
            },
            "externalId": {
              "type": "string",
              "description": "External identifier",
              "example": "ext-123",
              "nullable": true
            },
            "modificatedDate": {
              "type": "string",
              "description": "Modification date",
              "example": "1633021234567"
            },
            "parent": {
              "type": "string",
              "description": "Parent project identifier in P-uuid format",
              "example": "P-9f1b1c3e-8b9a-4c17-9de0-83c6a9d9cba1",
              "nullable": true
            },
            "parentOrder": {
              "type": "number",
              "description": "Order in parent project",
              "example": 100
            },
            "fake": {
              "type": "boolean",
              "description": "Fake element flag",
              "example": false
            },
            "removed": {
              "type": "boolean",
              "description": "Deletion flag",
              "example": false
            },
            "modificated": {
              "type": "object",
              "description": "Field modification information"
            }
          },
          "required": [
            "id",
            "title",
            "externalId",
            "modificatedDate",
            "parent",
            "parentOrder",
            "fake",
            "removed"
          ]
        },
        "ProjectCreateResponseDto": {
          "type": "object",
          "properties": {
            "project": {
              "$ref": "#/components/schemas/ProjectResponseDto"
            },
            "taskGroup": {
              "$ref": "#/components/schemas/TaskGroupResponseDto"
            }
          },
          "required": [
            "project",
            "taskGroup"
          ]
        },
        "ProjectUpdateDto": {
          "type": "object",
          "properties": {
            "title": {
              "type": "string",
              "description": "Project title"
            },
            "note": {
              "type": "string",
              "description": "Project note in delta format"
            },
            "start": {
              "type": "string",
              "description": "Planned project start date, ISO 8601 date string"
            },
            "end": {
              "type": "string",
              "description": "Planned project snd date, ISO 8601 date string"
            },
            "showInBasket": {
              "type": "boolean",
              "description": "Show in basket"
            },
            "emoji": {
              "type": "string",
              "description": "Emoji"
            },
            "color": {
              "type": "string",
              "description": "Color, valid hex color (e.g. #FF0000)"
            },
            "externalId": {
              "type": "string",
              "description": "External system identifier"
            },
            "reviewValidationDate": {
              "type": "string",
              "description": "Review validation date, ISO 8601 date string"
            },
            "reviewValidationInterval": {
              "type": "number",
              "description": "Review validation interval as an integer: -1 = DEF (default), 0 = NEVER, 1 = ONEWEEK, 2 = TWOWEEKS, 3 = ONEMONTH, 4 = SIXMONTH. Send the number, not the name.",
              "enum": [
                0,
                1,
                2,
                3,
                4,
                -1
              ],
              "example": -1
            },
            "parent": {
              "type": "string",
              "pattern": "^(?:P)-",
              "format": "singularity-id",
              "example": "P-123e4567-e89b-12d3-a456-426614174000",
              "description": "Parent project ID, must start with P- (e.g. P-abc-123)"
            },
            "parentOrder": {
              "type": "number",
              "description": "Order in parent project"
            },
            "isNotebook": {
              "type": "boolean",
              "description": "Is notebook project"
            },
            "deleteDate": {
              "type": "string",
              "description": "Deletion date to basket, ISO 8601 date string"
            },
            "journalDate": {
              "type": "string",
              "description": "Archivation date, ISO 8601 date string. Fill only is you want to archivate project!"
            }
          }
        },
        "ProjectArchiveDto": {
          "type": "object",
          "properties": {
            "journalDate": {
              "type": "string",
              "description": "Archivation date, ISO 8601 date string"
            }
          }
        },
        "TaskGroupListDto": {
          "type": "object",
          "properties": {
            "maxCount": {
              "type": "number",
              "description": "Maximum count, integer 1–1000",
              "maximum": 1000
            },
            "offset": {
              "type": "number",
              "description": "Offset for pagination, integer ≥ 0",
              "minimum": 0
            },
            "modifiedSince": {
              "type": "string",
              "description": "Return entities modified since the given sync timestamp (full ISO datetime with time component, e.g. 2026-07-01T00:00:00.000Z). Offsets like +03:00 are accepted and normalized to UTC Z before comparison."
            },
            "paginationData": {
              "type": "boolean",
              "description": "Include `pagination` block in response with `total/count/offset`. Default `false`.",
              "default": false
            },
            "includeRemoved": {
              "type": "boolean",
              "description": "Include removed task groups",
              "default": false
            },
            "parent": {
              "type": "string",
              "pattern": "^(?:P)-",
              "format": "singularity-id",
              "example": "P-123e4567-e89b-12d3-a456-426614174000",
              "description": "Parent project ID for filtering, must start with P-"
            }
          }
        },
        "TaskGroupListResponseDto": {
          "type": "object",
          "properties": {
            "pagination": {
              "description": "Pagination metadata",
              "allOf": [
                {
                  "$ref": "#/components/schemas/PaginationResponseDto"
                }
              ]
            },
            "taskGroups": {
              "description": "List of task groups",
              "type": "array",
              "items": {
                "$ref": "#/components/schemas/TaskGroupResponseDto"
              }
            }
          },
          "required": [
            "taskGroups"
          ]
        },
        "TaskGroupCreateDto": {
          "type": "object",
          "properties": {
            "title": {
              "type": "string",
              "description": "Task group title, required when fake=false, must be empty when fake=true",
              "example": "Important tasks"
            },
            "externalId": {
              "type": "string",
              "description": "External identifier",
              "example": "ext-123"
            },
            "parent": {
              "type": "string",
              "pattern": "^(?:P)-",
              "format": "singularity-id",
              "example": "P-123e4567-e89b-12d3-a456-426614174000",
              "description": "Parent project ID, must start with P- (e.g. P-abc-123)"
            },
            "parentOrder": {
              "type": "number",
              "description": "Order in parent project",
              "example": 100
            },
            "fake": {
              "type": "boolean",
              "description": "Fake element flag",
              "example": false,
              "default": false
            }
          },
          "required": [
            "title",
            "parent"
          ]
        },
        "TaskGroupUpdateDto": {
          "type": "object",
          "properties": {
            "title": {
              "type": "string",
              "description": "Task group title, must be empty when fake=true",
              "example": "Important tasks"
            },
            "externalId": {
              "type": "string",
              "description": "External identifier",
              "example": "ext-123"
            },
            "parent": {
              "type": "string",
              "pattern": "^(?:P)-",
              "format": "singularity-id",
              "example": "P-123e4567-e89b-12d3-a456-426614174000",
              "description": "Parent project ID, must start with P- (e.g. P-abc-123)"
            },
            "parentOrder": {
              "type": "number",
              "description": "Order in parent project",
              "example": 100
            },
            "fake": {
              "type": "boolean",
              "description": "Fake element flag",
              "example": false
            }
          }
        },
        "TaskListDto": {
          "type": "object",
          "properties": {
            "maxCount": {
              "type": "number",
              "description": "Maximum count, integer 1–1000",
              "maximum": 1000
            },
            "offset": {
              "type": "number",
              "description": "Offset for pagination, integer ≥ 0",
              "minimum": 0
            },
            "modifiedSince": {
              "type": "string",
              "description": "Return entities modified since the given sync timestamp (full ISO datetime with time component, e.g. 2026-07-01T00:00:00.000Z). Offsets like +03:00 are accepted and normalized to UTC Z before comparison."
            },
            "paginationData": {
              "type": "boolean",
              "description": "Include `pagination` block in response with `total/count/offset`. Default `false`.",
              "default": false
            },
            "includeRemoved": {
              "type": "boolean",
              "description": "Include removed tasks",
              "default": false
            },
            "includeArchived": {
              "type": "boolean",
              "description": "Include archived tasks",
              "default": false
            },
            "includeAllRecurrenceInstances": {
              "type": "boolean",
              "description": "Include all instances of recurring tasks. Default `false`. ⚠️ When `false` (default), the server over-fetches rows and applies a post-filter. As a result `count` in the response can be smaller than the requested `maxCount`, and offset-based pagination may show gaps in the listing. For reliable offset-pagination over `task` pass `includeAllRecurrenceInstances=true`.",
              "default": false
            },
            "projectId": {
              "type": "string",
              "pattern": "^(?:P)-",
              "format": "singularity-id",
              "example": "P-123e4567-e89b-12d3-a456-426614174000",
              "description": "Filter by project ID, must start with P-"
            },
            "parent": {
              "type": "string",
              "pattern": "^(?:T)-",
              "format": "singularity-id",
              "example": "T-123e4567-e89b-12d3-a456-426614174000",
              "description": "Filter by parent task ID, must start with T-"
            },
            "group": {
              "type": "string",
              "pattern": "^(?:Q)-",
              "format": "singularity-id",
              "example": "Q-123e4567-e89b-12d3-a456-426614174000",
              "description": "Filter by task group ID, must start with Q-"
            },
            "start": {
              "type": "string",
              "description": "Filter by start date"
            },
            "deadline": {
              "type": "string",
              "description": "Filter by deadline"
            },
            "journalDate": {
              "type": "string",
              "description": "Filter by date of archivation"
            },
            "deleteDate": {
              "type": "string",
              "description": "Filter by delete date"
            },
            "checked": {
              "type": "number",
              "description": "Filter by checked status"
            },
            "priority": {
              "type": "number",
              "description": "Filter by task priority"
            },
            "state": {
              "type": "number",
              "description": "Filter by task state"
            },
            "isNote": {
              "type": "boolean",
              "description": "Filter by note flag"
            },
            "deferred": {
              "type": "boolean",
              "description": "Filter by deferred flag"
            },
            "tags": {
              "description": "Filter by tags",
              "type": "array",
              "items": {
                "type": "string"
              }
            }
          }
        },
        "TaskResponseDto": {
          "type": "object",
          "properties": {
            "id": {
              "type": "string",
              "description": "Task ID"
            },
            "externalId": {
              "type": "string",
              "description": "External ID"
            },
            "title": {
              "type": "string",
              "description": "Task title"
            },
            "note": {
              "type": "string",
              "description": "Task note"
            },
            "priority": {
              "type": "number",
              "description": "Task priority"
            },
            "recurrence": {
              "type": "object",
              "description": "Recurring task"
            },
            "journalDate": {
              "type": "string",
              "description": "Archivation date"
            },
            "complete": {
              "type": "number",
              "description": "Completion status"
            },
            "completeLast": {
              "type": "string",
              "description": "Last completion date"
            },
            "state": {
              "type": "number",
              "description": "Task state"
            },
            "checked": {
              "type": "number",
              "description": "Check status"
            },
            "showInBasket": {
              "type": "boolean",
              "description": "Show in basket"
            },
            "deleteDate": {
              "type": "string",
              "description": "Deletion date"
            },
            "projectId": {
              "type": "string",
              "description": "Project ID"
            },
            "recurrenceGeneratorId": {
              "type": "string",
              "description": "Recurrence generator ID"
            },
            "start": {
              "type": "string",
              "description": "Start date"
            },
            "startNotifyReaded": {
              "type": "boolean",
              "description": "Start notification read"
            },
            "notify": {
              "type": "number",
              "description": "Notification time"
            },
            "startNotifiesReaded": {
              "description": "List of read start notifications",
              "type": "array",
              "items": {
                "type": "number"
              }
            },
            "notifies": {
              "description": "List of notifications",
              "type": "array",
              "items": {
                "type": "number"
              }
            },
            "useTime": {
              "type": "boolean",
              "description": "Use time"
            },
            "crypted": {
              "type": "string",
              "description": "Encrypted content"
            },
            "deferred": {
              "type": "boolean",
              "description": "Deferred"
            },
            "deadline": {
              "type": "string",
              "description": "Deadline"
            },
            "deadlineNotifyReaded": {
              "type": "boolean",
              "description": "Deadline notification read"
            },
            "parent": {
              "type": "string",
              "description": "Parent task ID"
            },
            "group": {
              "type": "string",
              "description": "Group ID"
            },
            "createdDate": {
              "type": "string",
              "description": "Creation date"
            },
            "modificatedDate": {
              "type": "string",
              "description": "Modification date"
            },
            "scheduleOrder": {
              "type": "number",
              "description": "Schedule order"
            },
            "parentOrder": {
              "type": "number",
              "description": "Order in parent task"
            },
            "integrationItemId": {
              "type": "string",
              "description": "Integration item ID"
            },
            "seenToday": {
              "type": "string",
              "description": "Seen today"
            },
            "timeLength": {
              "type": "number",
              "description": "Duration in minutes"
            },
            "pomodoroCount": {
              "type": "number",
              "description": "Pomodoro count"
            },
            "pomodoroTotalTime": {
              "type": "number",
              "description": "Total pomodoro time"
            },
            "alarmNotify": {
              "type": "boolean",
              "description": "Alarm notification"
            },
            "isNote": {
              "type": "boolean",
              "description": "Is note"
            },
            "tags": {
              "description": "Tags",
              "type": "array",
              "items": {
                "type": "string"
              }
            },
            "removed": {
              "type": "boolean",
              "description": "Removed"
            },
            "modificated": {
              "type": "object",
              "description": "Task modifications"
            }
          },
          "required": [
            "id",
            "externalId",
            "title",
            "note",
            "priority",
            "journalDate",
            "complete",
            "completeLast",
            "state",
            "checked",
            "showInBasket",
            "deleteDate",
            "projectId",
            "recurrenceGeneratorId",
            "start",
            "startNotifyReaded",
            "notify",
            "startNotifiesReaded",
            "notifies",
            "useTime",
            "crypted",
            "deferred",
            "deadline",
            "deadlineNotifyReaded",
            "parent",
            "group",
            "createdDate",
            "modificatedDate",
            "scheduleOrder",
            "parentOrder",
            "integrationItemId",
            "seenToday",
            "timeLength",
            "pomodoroCount",
            "pomodoroTotalTime",
            "alarmNotify",
            "isNote",
            "tags",
            "removed",
            "modificated"
          ]
        },
        "TaskListResponseDto": {
          "type": "object",
          "properties": {
            "pagination": {
              "description": "Pagination metadata",
              "allOf": [
                {
                  "$ref": "#/components/schemas/PaginationResponseDto"
                }
              ]
            },
            "tasks": {
              "description": "List of tasks",
              "type": "array",
              "items": {
                "$ref": "#/components/schemas/TaskResponseDto"
              }
            }
          },
          "required": [
            "tasks"
          ]
        },
        "TaskCreateDto": {
          "type": "object",
          "properties": {
            "title": {
              "type": "string",
              "description": "Task title"
            },
            "note": {
              "type": "string",
              "description": "Task note in delta format"
            },
            "priority": {
              "type": "number",
              "description": "Task priority as an integer: 0 = HIGH, 1 = NORMAL (default), 2 = LOW. Send the number, not the name.",
              "enum": [
                0,
                1,
                2
              ],
              "example": 1
            },
            "journalDate": {
              "type": "string",
              "description": "Archivation date, ISO 8601 date string. Fill only is you want to archivate task!"
            },
            "deleteDate": {
              "type": "string",
              "description": "Deletion date to basket, ISO 8601 date string"
            },
            "complete": {
              "type": "number",
              "description": "Completion progress, integer 0–999"
            },
            "state": {
              "type": "number",
              "description": "Task pin state as an integer: 0 = PINNED, 1 = UNPINNED. Send the number, not the name.",
              "enum": [
                0,
                1
              ],
              "example": 1
            },
            "checked": {
              "type": "number",
              "description": "Check status as an integer: 0 = EMPTY, 1 = CHECKED, 2 = CANCELLED. Send the number, not the name.",
              "enum": [
                0,
                1,
                2
              ],
              "example": 0
            },
            "showInBasket": {
              "type": "boolean",
              "description": "Show in basket"
            },
            "projectId": {
              "type": "string",
              "pattern": "^(?:P)-",
              "format": "singularity-id",
              "example": "P-123e4567-e89b-12d3-a456-426614174000",
              "description": "Project ID, must start with P- (e.g. P-abc-123)"
            },
            "start": {
              "type": "string",
              "description": "Planned task start date, ISO 8601 date string"
            },
            "startNotifiesReaded": {
              "description": "List of read start notifications",
              "type": "array",
              "items": {
                "type": "number"
              }
            },
            "notifies": {
              "description": "Pre-start notifications as integer minutes before the task `start` time. Each value N fires one notification N minutes before the task begins. Example: [10, 60] sends a notification 10 minutes and 1 hour before start.",
              "type": "array",
              "items": {
                "type": "number"
              }
            },
            "alarmNotify": {
              "type": "boolean",
              "description": "Rings the alarm when the notifies times arrives"
            },
            "useTime": {
              "type": "boolean",
              "description": "Use time"
            },
            "deferred": {
              "type": "boolean",
              "description": "Deferred"
            },
            "deadline": {
              "type": "string",
              "description": "Deadline, ISO 8601 date string"
            },
            "deadlineNotifyReaded": {
              "type": "boolean",
              "description": "Deadline notification read"
            },
            "parent": {
              "type": "string",
              "pattern": "^(?:T)-",
              "format": "singularity-id",
              "example": "T-123e4567-e89b-12d3-a456-426614174000",
              "description": "Parent task ID, must start with T- (e.g. T-abc-123)"
            },
            "group": {
              "type": "string",
              "pattern": "^(?:Q)-",
              "format": "singularity-id",
              "example": "Q-123e4567-e89b-12d3-a456-426614174000",
              "description": "Group ID, must start with Q- (e.g. Q-abc-123)"
            },
            "scheduleOrder": {
              "type": "number",
              "description": "Schedule order"
            },
            "parentOrder": {
              "type": "number",
              "description": "Order in parent task"
            },
            "timeLength": {
              "type": "number",
              "description": "Duration in minutes"
            },
            "responsible": {
              "type": "string",
              "description": "Responsible person"
            },
            "isNote": {
              "type": "boolean",
              "description": "Is note"
            },
            "tags": {
              "example": "A-123e4567-e89b-12d3-a456-426614174000",
              "items": {
                "type": "string",
                "format": "singularity-id",
                "pattern": "^(?:A)-"
              },
              "description": "Tag IDs, each must start with A- (e.g. A-abc-123)",
              "type": "array"
            },
            "externalId": {
              "type": "string",
              "description": "External ID"
            }
          },
          "required": [
            "title"
          ]
        },
        "TaskUpdateDto": {
          "type": "object",
          "properties": {
            "title": {
              "type": "string",
              "description": "Task title"
            },
            "note": {
              "type": "string",
              "description": "Task note in delta format"
            },
            "priority": {
              "type": "number",
              "description": "Task priority",
              "enum": [
                0,
                1,
                2
              ]
            },
            "journalDate": {
              "type": "string",
              "description": "Archivation date, ISO 8601 date string. Fill only is you want to archivate task!"
            },
            "complete": {
              "type": "number",
              "description": "Completion progress, integer 0–999"
            },
            "state": {
              "type": "number",
              "description": "Task state",
              "enum": [
                0,
                1
              ]
            },
            "checked": {
              "type": "number",
              "description": "Check status",
              "enum": [
                0,
                1,
                2
              ]
            },
            "showInBasket": {
              "type": "boolean",
              "description": "Show in basket"
            },
            "deleteDate": {
              "type": "string",
              "description": "Deletion date to basket, ISO 8601 date string"
            },
            "projectId": {
              "type": "string",
              "pattern": "^(?:P)-",
              "format": "singularity-id",
              "example": "P-123e4567-e89b-12d3-a456-426614174000",
              "description": "Project ID, must start with P- (e.g. P-abc-123)"
            },
            "start": {
              "type": "string",
              "description": "Planned task start date, ISO 8601 date string"
            },
            "startNotifiesReaded": {
              "description": "List of read start notifications",
              "type": "array",
              "items": {
                "type": "number"
              }
            },
            "notifies": {
              "description": "Pre-start notifications as integer minutes before the task `start` time. Each value N fires one notification N minutes before the task begins. Example: [10, 60] sends a notification 10 minutes and 1 hour before start.",
              "type": "array",
              "items": {
                "type": "number"
              }
            },
            "alarmNotify": {
              "type": "boolean",
              "description": "Rings the alarm when the notifies times arrives"
            },
            "useTime": {
              "type": "boolean",
              "description": "Use time"
            },
            "deferred": {
              "type": "boolean",
              "description": "Deferred"
            },
            "deadline": {
              "type": "string",
              "description": "Deadline, ISO 8601 date string"
            },
            "deadlineNotifyReaded": {
              "type": "boolean",
              "description": "Deadline notification read"
            },
            "parent": {
              "type": "string",
              "pattern": "^(?:T)-",
              "format": "singularity-id",
              "example": "T-123e4567-e89b-12d3-a456-426614174000",
              "description": "Parent task ID, must start with T- (e.g. T-abc-123)"
            },
            "group": {
              "type": "string",
              "pattern": "^(?:Q)-",
              "format": "singularity-id",
              "example": "Q-123e4567-e89b-12d3-a456-426614174000",
              "description": "Group ID, must start with Q- (e.g. Q-abc-123)"
            },
            "scheduleOrder": {
              "type": "number",
              "description": "Schedule order"
            },
            "parentOrder": {
              "type": "number",
              "description": "Order in parent task"
            },
            "timeLength": {
              "type": "number",
              "description": "Duration in minutes"
            },
            "responsible": {
              "type": "string",
              "description": "Responsible person"
            },
            "isNote": {
              "type": "boolean",
              "description": "Is note"
            },
            "tags": {
              "example": "A-123e4567-e89b-12d3-a456-426614174000",
              "items": {
                "type": "string",
                "format": "singularity-id",
                "pattern": "^(?:A)-"
              },
              "description": "Tag IDs, each must start with A- (e.g. A-abc-123)",
              "type": "array"
            },
            "externalId": {
              "type": "string",
              "description": "External ID"
            },
            "kanbanStatusId": {
              "type": "string",
              "pattern": "^(?:KS)-",
              "format": "singularity-id",
              "example": "KS-123e4567-e89b-12d3-a456-426614174000",
              "description": "Kanban status ID, must start with KS- (e.g. KS-abc-123)"
            }
          }
        },
        "ArchiveTaskDto": {
          "type": "object",
          "properties": {
            "journalDate": {
              "type": "string",
              "description": "Archivation date, ISO 8601 date string"
            }
          }
        },
        "MoveTaskDto": {
          "type": "object",
          "properties": {
            "projectId": {
              "type": "string",
              "pattern": "^(?:P)-",
              "format": "singularity-id",
              "example": "P-123e4567-e89b-12d3-a456-426614174000",
              "description": "Project ID, must start with P- (e.g. P-abc-123)"
            },
            "groupId": {
              "type": "string",
              "pattern": "^(?:Q)-",
              "format": "singularity-id",
              "example": "Q-123e4567-e89b-12d3-a456-426614174000",
              "description": "Task group ID"
            },
            "parent": {
              "type": "string",
              "pattern": "^(?:T)-",
              "format": "singularity-id",
              "example": "T-123e4567-e89b-12d3-a456-426614174000",
              "description": "Parent task ID"
            }
          },
          "required": [
            "projectId"
          ]
        },
        "ChangeTaskColumnDto": {
          "type": "object",
          "properties": {
            "statusId": {
              "type": "string",
              "pattern": "^(?:KS)-",
              "format": "singularity-id",
              "example": "KS-123e4567-e89b-12d3-a456-426614174000",
              "description": "Kanban status ID, must start with KS- (e.g. KS-abc-123)"
            }
          },
          "required": [
            "statusId"
          ]
        },
        "KanbanStatusListDto": {
          "type": "object",
          "properties": {
            "maxCount": {
              "type": "number",
              "description": "Maximum count, integer 1–1000",
              "maximum": 1000
            },
            "offset": {
              "type": "number",
              "description": "Offset for pagination, integer ≥ 0",
              "minimum": 0
            },
            "modifiedSince": {
              "type": "string",
              "description": "Return entities modified since the given sync timestamp (full ISO datetime with time component, e.g. 2026-07-01T00:00:00.000Z). Offsets like +03:00 are accepted and normalized to UTC Z before comparison."
            },
            "paginationData": {
              "type": "boolean",
              "description": "Include `pagination` block in response with `total/count/offset`. Default `false`.",
              "default": false
            },
            "includeRemoved": {
              "type": "boolean",
              "description": "Include removed statuses",
              "example": false,
              "default": false
            },
            "projectId": {
              "type": "string",
              "pattern": "^(?:P)-",
              "format": "singularity-id",
              "example": "P-123e4567-e89b-12d3-a456-426614174000",
              "description": "Project ID for filtering, must start with P-"
            }
          }
        },
        "KanbanStatusResponseDto": {
          "type": "object",
          "properties": {
            "id": {
              "type": "string",
              "description": "Kanban status ID in KS-uuid format",
              "example": "KS-9f1b1c3e-8b9a-4c17-9de0-83c6a9d9cba1"
            },
            "modificatedDate": {
              "type": "string",
              "description": "Modification date",
              "example": "1590000000000"
            },
            "removed": {
              "type": "boolean",
              "description": "Deletion flag",
              "example": false
            },
            "name": {
              "type": "string",
              "description": "Kanban status name",
              "example": "In progress"
            },
            "projectId": {
              "type": "string",
              "description": "Project ID that the kanban status belongs to in P-uuid format",
              "example": "P-9f1b1c3e-8b9a-4c17-9de0-83c6a9d9cba1"
            },
            "kanbanOrder": {
              "type": "number",
              "description": "Display order of status in kanban",
              "example": 1
            },
            "numberOfColumns": {
              "type": "number",
              "description": "Number of columns in kanban status",
              "example": 1
            },
            "modificated": {
              "type": "object",
              "description": "Modification information",
              "example": {
                "removed": 1590000000000,
                "name": 1590000000000,
                "projectId": 1590000000000,
                "kanbanOrder": 1590000000000,
                "numberOfColumns": 1590000000000
              }
            }
          },
          "required": [
            "id",
            "modificatedDate",
            "removed",
            "name",
            "projectId",
            "kanbanOrder",
            "numberOfColumns"
          ]
        },
        "KanbanStatusListResponseDto": {
          "type": "object",
          "properties": {
            "pagination": {
              "description": "Pagination metadata",
              "allOf": [
                {
                  "$ref": "#/components/schemas/PaginationResponseDto"
                }
              ]
            },
            "kanbanStatuses": {
              "description": "List of kanban statuses",
              "type": "array",
              "items": {
                "$ref": "#/components/schemas/KanbanStatusResponseDto"
              }
            }
          },
          "required": [
            "kanbanStatuses"
          ]
        },
        "KanbanStatusCreateDto": {
          "type": "object",
          "properties": {
            "externalId": {
              "type": "string",
              "description": "External kanban status identifier",
              "example": "external-id-123"
            },
            "name": {
              "type": "string",
              "description": "Kanban status name",
              "example": "In progress"
            },
            "projectId": {
              "type": "string",
              "pattern": "^(?:P)-",
              "format": "singularity-id",
              "example": "P-123e4567-e89b-12d3-a456-426614174000",
              "description": "Project ID, must start with P- (e.g. P-abc-123)"
            },
            "kanbanOrder": {
              "type": "number",
              "description": "Display order of status in kanban",
              "example": 1,
              "default": 0
            },
            "numberOfColumns": {
              "type": "number",
              "description": "Number of columns in kanban status, integer 1–100",
              "example": 1,
              "default": 1
            }
          },
          "required": [
            "name",
            "projectId"
          ]
        },
        "KanbanStatusUpdateDto": {
          "type": "object",
          "properties": {
            "externalId": {
              "type": "string",
              "description": "External kanban status identifier",
              "example": "external-id-123"
            },
            "name": {
              "type": "string",
              "description": "Kanban status name",
              "example": "In progress"
            },
            "projectId": {
              "type": "string",
              "pattern": "^(?:P)-",
              "format": "singularity-id",
              "example": "P-123e4567-e89b-12d3-a456-426614174000",
              "description": "Project ID, must start with P- (e.g. P-abc-123)"
            },
            "kanbanOrder": {
              "type": "number",
              "description": "Display order of status in kanban",
              "example": 1
            },
            "numberOfColumns": {
              "type": "number",
              "description": "Number of columns in kanban status, integer 1–100",
              "example": 1
            }
          }
        },
        "KanbanTaskStatusListDto": {
          "type": "object",
          "properties": {
            "maxCount": {
              "type": "number",
              "description": "Maximum count, integer 1–1000",
              "maximum": 1000
            },
            "offset": {
              "type": "number",
              "description": "Offset for pagination, integer ≥ 0",
              "minimum": 0
            },
            "modifiedSince": {
              "type": "string",
              "description": "Return entities modified since the given sync timestamp (full ISO datetime with time component, e.g. 2026-07-01T00:00:00.000Z). Offsets like +03:00 are accepted and normalized to UTC Z before comparison."
            },
            "paginationData": {
              "type": "boolean",
              "description": "Include `pagination` block in response with `total/count/offset`. Default `false`.",
              "default": false
            },
            "includeRemoved": {
              "type": "boolean",
              "description": "Include removed links",
              "example": false,
              "default": false
            },
            "taskId": {
              "type": "string",
              "pattern": "^(?:T)-",
              "format": "singularity-id",
              "example": "T-123e4567-e89b-12d3-a456-426614174000",
              "description": "Task ID for filtering, must start with T-"
            },
            "statusId": {
              "type": "string",
              "pattern": "^(?:KS)-",
              "format": "singularity-id",
              "example": "KS-123e4567-e89b-12d3-a456-426614174000",
              "description": "Kanban status ID for filtering, must start with KS-"
            }
          }
        },
        "KanbanTaskStatusResponseDto": {
          "type": "object",
          "properties": {
            "id": {
              "type": "string",
              "description": "Task-kanban status link ID in KTS-uuid format",
              "example": "KTS-9f1b1c3e-8b9a-4c17-9de0-83c6a9d9cba1"
            },
            "modificatedDate": {
              "type": "string",
              "description": "Modification date",
              "example": "1590000000000"
            },
            "removed": {
              "type": "boolean",
              "description": "Deletion flag",
              "example": false
            },
            "taskId": {
              "type": "string",
              "description": "Task ID in T-uuid format",
              "example": "T-9f1b1c3e-8b9a-4c17-9de0-83c6a9d9cba1"
            },
            "statusId": {
              "type": "string",
              "description": "Kanban status ID in KS-uuid format",
              "example": "KS-9f1b1c3e-8b9a-4c17-9de0-83c6a9d9cba1"
            },
            "kanbanOrder": {
              "type": "number",
              "description": "Display order of task in kanban status",
              "example": 1
            },
            "modificated": {
              "type": "object",
              "description": "Modification information",
              "example": {
                "removed": 1590000000000,
                "taskId": 1590000000000,
                "statusId": 1590000000000,
                "kanbanOrder": 1590000000000
              }
            }
          },
          "required": [
            "id",
            "modificatedDate",
            "removed",
            "taskId",
            "statusId",
            "kanbanOrder"
          ]
        },
        "KanbanTaskStatusListResponseDto": {
          "type": "object",
          "properties": {
            "pagination": {
              "description": "Pagination metadata",
              "allOf": [
                {
                  "$ref": "#/components/schemas/PaginationResponseDto"
                }
              ]
            },
            "kanbanTaskStatuses": {
              "description": "List of task-kanban status links",
              "type": "array",
              "items": {
                "$ref": "#/components/schemas/KanbanTaskStatusResponseDto"
              }
            }
          },
          "required": [
            "kanbanTaskStatuses"
          ]
        },
        "KanbanTaskStatusCreateDto": {
          "type": "object",
          "properties": {
            "externalId": {
              "type": "string",
              "description": "External identifier for task-kanban status link",
              "example": "external-id-123"
            },
            "taskId": {
              "type": "string",
              "pattern": "^(?:T)-",
              "format": "singularity-id",
              "example": "T-123e4567-e89b-12d3-a456-426614174000",
              "description": "Task ID, must start with T- (e.g. T-abc-123)"
            },
            "statusId": {
              "type": "string",
              "pattern": "^(?:KS)-",
              "format": "singularity-id",
              "example": "KS-123e4567-e89b-12d3-a456-426614174000",
              "description": "Kanban status ID, must start with KS- (e.g. KS-abc-123)"
            },
            "kanbanOrder": {
              "type": "number",
              "description": "Display order of task in kanban status",
              "example": 1,
              "default": 0
            }
          },
          "required": [
            "taskId",
            "statusId"
          ]
        },
        "KanbanTaskStatusUpdateDto": {
          "type": "object",
          "properties": {
            "externalId": {
              "type": "string",
              "description": "External identifier for task-kanban status link",
              "example": "external-id-123"
            },
            "taskId": {
              "type": "string",
              "pattern": "^(?:T)-",
              "format": "singularity-id",
              "example": "T-123e4567-e89b-12d3-a456-426614174000",
              "description": "Task ID, must start with T- (e.g. T-abc-123)"
            },
            "statusId": {
              "type": "string",
              "pattern": "^(?:KS)-",
              "format": "singularity-id",
              "example": "KS-123e4567-e89b-12d3-a456-426614174000",
              "description": "Kanban status ID, must start with KS- (e.g. KS-abc-123)"
            },
            "kanbanOrder": {
              "type": "number",
              "description": "Display order of task in kanban status",
              "example": 1
            }
          }
        },
        "HabitListDto": {
          "type": "object",
          "properties": {
            "maxCount": {
              "type": "number",
              "description": "Maximum count, integer 1–1000",
              "maximum": 1000
            },
            "offset": {
              "type": "number",
              "description": "Offset for pagination, integer ≥ 0",
              "minimum": 0
            },
            "modifiedSince": {
              "type": "string",
              "description": "Return entities modified since the given sync timestamp (full ISO datetime with time component, e.g. 2026-07-01T00:00:00.000Z). Offsets like +03:00 are accepted and normalized to UTC Z before comparison."
            },
            "paginationData": {
              "type": "boolean",
              "description": "Include `pagination` block in response with `total/count/offset`. Default `false`.",
              "default": false
            },
            "includeArchived": {
              "type": "boolean",
              "description": "Include archived habits",
              "default": false
            },
            "status": {
              "type": "number",
              "description": "Filter by habit status"
            }
          }
        },
        "HabitResponseDto": {
          "type": "object",
          "properties": {
            "id": {
              "type": "string",
              "description": "Habit identifier"
            },
            "title": {
              "type": "string",
              "description": "Habit title"
            },
            "description": {
              "type": "string",
              "description": "Habit description"
            },
            "color": {
              "type": "string",
              "description": "Habit color",
              "enum": [
                "red",
                "pink",
                "purple",
                "deepPurple",
                "indigo",
                "lightBlue",
                "cyan",
                "teal",
                "green",
                "lightGreen",
                "lime",
                "yellow",
                "amber",
                "orange",
                "deepOrange",
                "brown",
                "grey",
                "blueGrey"
              ]
            },
            "order": {
              "type": "number",
              "description": "Habit order number"
            },
            "status": {
              "type": "number",
              "description": "Habit status",
              "enum": [
                0,
                1,
                2,
                3
              ]
            },
            "modificatedDate": {
              "type": "string",
              "description": "Last modification date"
            },
            "modificated": {
              "type": "object",
              "description": "Modification information"
            },
            "removed": {
              "type": "boolean",
              "description": "Deletion flag"
            },
            "externalId": {
              "type": "string",
              "description": "External habit identifier"
            }
          },
          "required": [
            "id",
            "title",
            "status",
            "modificatedDate",
            "removed"
          ]
        },
        "HabitListResponseDto": {
          "type": "object",
          "properties": {
            "pagination": {
              "description": "Pagination metadata",
              "allOf": [
                {
                  "$ref": "#/components/schemas/PaginationResponseDto"
                }
              ]
            },
            "habits": {
              "description": "List of habits",
              "type": "array",
              "items": {
                "$ref": "#/components/schemas/HabitResponseDto"
              }
            }
          },
          "required": [
            "habits"
          ]
        },
        "HabitCreateDto": {
          "type": "object",
          "properties": {
            "title": {
              "type": "string",
              "description": "Habit title"
            },
            "description": {
              "type": "string",
              "description": "Habit description"
            },
            "color": {
              "type": "string",
              "description": "Habit color",
              "enum": [
                "red",
                "pink",
                "purple",
                "deepPurple",
                "indigo",
                "lightBlue",
                "cyan",
                "teal",
                "green",
                "lightGreen",
                "lime",
                "yellow",
                "amber",
                "orange",
                "deepOrange",
                "brown",
                "grey",
                "blueGrey"
              ]
            },
            "order": {
              "type": "number",
              "description": "Habit order number"
            },
            "status": {
              "type": "number",
              "description": "Habit status, only ACTIVE (0) and ARCHIVED (2) are allowed. PAUSED (1) and DELETED (3) are not supported via REST.",
              "enum": [
                0,
                1,
                2,
                3
              ],
              "default": 0
            },
            "externalId": {
              "type": "string",
              "description": "External habit identifier"
            }
          },
          "required": [
            "title"
          ]
        },
        "HabitUpdateDto": {
          "type": "object",
          "properties": {
            "title": {
              "type": "string",
              "description": "Habit title"
            },
            "description": {
              "type": "string",
              "description": "Habit description"
            },
            "color": {
              "type": "string",
              "description": "Habit color",
              "enum": [
                "red",
                "pink",
                "purple",
                "deepPurple",
                "indigo",
                "lightBlue",
                "cyan",
                "teal",
                "green",
                "lightGreen",
                "lime",
                "yellow",
                "amber",
                "orange",
                "deepOrange",
                "brown",
                "grey",
                "blueGrey"
              ]
            },
            "order": {
              "type": "number",
              "description": "Habit order number"
            },
            "status": {
              "type": "number",
              "description": "Habit status, only ACTIVE (0) and ARCHIVED (2) are allowed. PAUSED (1) and DELETED (3) are not supported via REST.",
              "enum": [
                0,
                1,
                2,
                3
              ]
            },
            "externalId": {
              "type": "string",
              "description": "External habit identifier"
            }
          }
        },
        "HabitDailyProgressListDto": {
          "type": "object",
          "properties": {
            "maxCount": {
              "type": "number",
              "description": "Maximum count, integer 1–1000",
              "maximum": 1000
            },
            "offset": {
              "type": "number",
              "description": "Offset for pagination, integer ≥ 0",
              "minimum": 0
            },
            "modifiedSince": {
              "type": "string",
              "description": "Return entities modified since the given sync timestamp (full ISO datetime with time component, e.g. 2026-07-01T00:00:00.000Z). Offsets like +03:00 are accepted and normalized to UTC Z before comparison."
            },
            "paginationData": {
              "type": "boolean",
              "description": "Include `pagination` block in response with `total/count/offset`. Default `false`.",
              "default": false
            },
            "habit": {
              "type": "string",
              "pattern": "^(?:HB)-",
              "format": "singularity-id",
              "example": "HB-123e4567-e89b-12d3-a456-426614174000",
              "description": "Habit ID for filtering, must start with HB-"
            },
            "date": {
              "type": "string",
              "description": "Filter by date"
            }
          }
        },
        "HabitDailyProgressResponseDto": {
          "type": "object",
          "properties": {
            "id": {
              "type": "string",
              "description": "Progress record identifier"
            },
            "habit": {
              "type": "string",
              "description": "Habit identifier"
            },
            "date": {
              "type": "string",
              "description": "Progress date in ISO format"
            },
            "progress": {
              "type": "number",
              "description": "Progress status",
              "enum": [
                0,
                1,
                2
              ]
            },
            "modificatedDate": {
              "type": "string",
              "description": "Last modification date"
            },
            "modificated": {
              "type": "object",
              "description": "Modification information"
            },
            "removed": {
              "type": "boolean",
              "description": "Deletion flag"
            },
            "externalId": {
              "type": "string",
              "description": "External identifier"
            }
          },
          "required": [
            "id",
            "habit",
            "date",
            "progress",
            "modificatedDate",
            "removed"
          ]
        },
        "HabitDailyProgressListResponseDto": {
          "type": "object",
          "properties": {
            "pagination": {
              "description": "Pagination metadata",
              "allOf": [
                {
                  "$ref": "#/components/schemas/PaginationResponseDto"
                }
              ]
            },
            "progressRecords": {
              "description": "List of progress records",
              "type": "array",
              "items": {
                "$ref": "#/components/schemas/HabitDailyProgressResponseDto"
              }
            }
          },
          "required": [
            "progressRecords"
          ]
        },
        "HabitDailyProgressCreateDto": {
          "type": "object",
          "properties": {
            "habit": {
              "type": "string",
              "pattern": "^(?:HB)-",
              "format": "singularity-id",
              "example": "HB-123e4567-e89b-12d3-a456-426614174000",
              "description": "Habit ID, must start with HB- (e.g. HB-abc-123)"
            },
            "date": {
              "type": "string",
              "description": "Progress date in YYYY-MM-DD format"
            },
            "progress": {
              "type": "number",
              "description": "Progress status as an integer: 0 = EMPTY, 1 = SKIP, 2 = FULL. Send the number, not the name.",
              "enum": [
                0,
                1,
                2
              ],
              "example": 0
            },
            "externalId": {
              "type": "string",
              "description": "External identifier"
            }
          },
          "required": [
            "habit",
            "date",
            "progress"
          ]
        },
        "HabitDailyProgressUpdateDto": {
          "type": "object",
          "properties": {
            "habit": {
              "type": "string",
              "pattern": "^(?:HB)-",
              "format": "singularity-id",
              "example": "HB-123e4567-e89b-12d3-a456-426614174000",
              "description": ""
            },
            "date": {
              "type": "string",
              "description": ""
            },
            "progress": {
              "type": "number",
              "description": "Progress status as an integer: 0 = EMPTY, 1 = SKIP, 2 = FULL. Send the number, not the name.",
              "enum": [
                0,
                1,
                2
              ],
              "example": 0
            },
            "externalId": {
              "type": "string",
              "description": "External identifier"
            }
          },
          "required": [
            "habit",
            "date"
          ]
        },
        "ChecklistItemListDto": {
          "type": "object",
          "properties": {
            "maxCount": {
              "type": "number",
              "description": "Maximum count, integer 1–1000",
              "maximum": 1000
            },
            "offset": {
              "type": "number",
              "description": "Offset for pagination, integer ≥ 0",
              "minimum": 0
            },
            "modifiedSince": {
              "type": "string",
              "description": "Return entities modified since the given sync timestamp (full ISO datetime with time component, e.g. 2026-07-01T00:00:00.000Z). Offsets like +03:00 are accepted and normalized to UTC Z before comparison."
            },
            "paginationData": {
              "type": "boolean",
              "description": "Include `pagination` block in response with `total/count/offset`. Default `false`.",
              "default": false
            },
            "includeRemoved": {
              "type": "boolean",
              "description": "Include removed items",
              "default": false
            },
            "parent": {
              "type": "string",
              "pattern": "^(?:T)-",
              "format": "singularity-id",
              "example": "T-123e4567-e89b-12d3-a456-426614174000",
              "description": "Parent task ID for filtering, must start with T-"
            }
          }
        },
        "ChecklistItemModificatedDto": {
          "type": "object",
          "properties": {
            "done": {
              "type": "number",
              "description": "Status modification marker"
            },
            "title": {
              "type": "number",
              "description": "Title modification marker"
            },
            "crypted": {
              "type": "number",
              "description": "Encrypted data modification marker"
            },
            "parent": {
              "type": "number",
              "description": "Parent entity modification marker"
            },
            "parentOrder": {
              "type": "number",
              "description": "Order modification marker"
            },
            "removed": {
              "type": "number",
              "description": "Deletion modification marker"
            }
          }
        },
        "ChecklistItemResponseDto": {
          "type": "object",
          "properties": {
            "id": {
              "type": "string",
              "description": "Checklist item ID",
              "example": "C-12345"
            },
            "modificatedDate": {
              "type": "string",
              "description": "Modification date",
              "example": "1584530599718"
            },
            "removed": {
              "type": "boolean",
              "description": "Deletion flag",
              "example": false
            },
            "parent": {
              "type": "string",
              "description": "Parent entity ID",
              "example": "T-12345"
            },
            "parentOrder": {
              "type": "number",
              "description": "Order number in the list",
              "example": 1
            },
            "title": {
              "type": "string",
              "description": "Item title",
              "example": "Buy milk"
            },
            "done": {
              "type": "boolean",
              "description": "Completion status",
              "example": false
            },
            "crypted": {
              "type": "string",
              "description": "Encrypted data"
            },
            "modificated": {
              "description": "Modification information",
              "allOf": [
                {
                  "$ref": "#/components/schemas/ChecklistItemModificatedDto"
                }
              ]
            }
          },
          "required": [
            "id",
            "parent",
            "parentOrder",
            "title",
            "done"
          ]
        },
        "ChecklistItemListResponseDto": {
          "type": "object",
          "properties": {
            "pagination": {
              "description": "Pagination metadata",
              "allOf": [
                {
                  "$ref": "#/components/schemas/PaginationResponseDto"
                }
              ]
            },
            "checklistItems": {
              "description": "List of checklist items",
              "type": "array",
              "items": {
                "$ref": "#/components/schemas/ChecklistItemResponseDto"
              }
            }
          },
          "required": [
            "checklistItems"
          ]
        },
        "ChecklistItemCreateDto": {
          "type": "object",
          "properties": {
            "parent": {
              "type": "string",
              "pattern": "^(?:T)-",
              "format": "singularity-id",
              "example": "T-123e4567-e89b-12d3-a456-426614174000",
              "description": "Parent task ID, must start with T- (e.g. T-abc-123)"
            },
            "title": {
              "type": "string",
              "description": "Item title",
              "example": "Buy milk"
            },
            "done": {
              "type": "boolean",
              "description": "Completion status",
              "default": false,
              "example": false
            },
            "crypted": {
              "type": "string",
              "description": "Encrypted data"
            },
            "parentOrder": {
              "type": "number",
              "description": "Order number in the list",
              "example": 1
            }
          },
          "required": [
            "parent",
            "title"
          ]
        },
        "ChecklistItemUpdateDto": {
          "type": "object",
          "properties": {
            "parent": {
              "type": "string",
              "pattern": "^(?:T)-",
              "format": "singularity-id",
              "example": "T-123e4567-e89b-12d3-a456-426614174000",
              "description": "Parent task ID, must start with T- (e.g. T-abc-123)"
            },
            "title": {
              "type": "string",
              "description": "Item title",
              "example": "Buy milk"
            },
            "done": {
              "type": "boolean",
              "description": "Completion status",
              "example": false
            },
            "crypted": {
              "type": "string",
              "description": "Encrypted data"
            },
            "parentOrder": {
              "type": "number",
              "description": "Order number in the list",
              "example": 2
            }
          }
        },
        "TagListDto": {
          "type": "object",
          "properties": {
            "maxCount": {
              "type": "number",
              "description": "Maximum count, integer 1–1000",
              "maximum": 1000
            },
            "offset": {
              "type": "number",
              "description": "Offset for pagination, integer ≥ 0",
              "minimum": 0
            },
            "modifiedSince": {
              "type": "string",
              "description": "Return entities modified since the given sync timestamp (full ISO datetime with time component, e.g. 2026-07-01T00:00:00.000Z). Offsets like +03:00 are accepted and normalized to UTC Z before comparison."
            },
            "paginationData": {
              "type": "boolean",
              "description": "Include `pagination` block in response with `total/count/offset`. Default `false`.",
              "default": false
            },
            "includeRemoved": {
              "type": "boolean",
              "description": "Include removed tags",
              "default": false
            },
            "parent": {
              "type": "string",
              "pattern": "^(?:A)-",
              "format": "singularity-id",
              "example": "A-123e4567-e89b-12d3-a456-426614174000",
              "description": "Parent tag ID for filtering, must start with A-"
            }
          }
        },
        "TagResponseDto": {
          "type": "object",
          "properties": {
            "id": {
              "type": "string",
              "description": "Tag identifier in A-uuid format",
              "example": "A-9f1b1c3e-8b9a-4c17-9de0-83c6a9d9cba1"
            },
            "title": {
              "type": "string",
              "description": "Tag title"
            },
            "externalId": {
              "type": "string",
              "description": "External identifier"
            },
            "hotkey": {
              "type": "number",
              "description": "Hotkey"
            },
            "parent": {
              "type": "string",
              "description": "Parent tag"
            },
            "parentOrder": {
              "type": "number",
              "description": "Order in parent tag"
            },
            "modificatedDate": {
              "type": "string",
              "description": "Modification date"
            },
            "removed": {
              "type": "boolean",
              "description": "Deletion flag"
            },
            "color": {
              "type": "string",
              "description": "Tag color"
            },
            "modificated": {
              "type": "object",
              "description": "Modification information"
            }
          },
          "required": [
            "id",
            "title",
            "externalId",
            "hotkey",
            "parent",
            "parentOrder",
            "modificatedDate",
            "removed",
            "color"
          ]
        },
        "TagListResponseDto": {
          "type": "object",
          "properties": {
            "pagination": {
              "description": "Pagination metadata",
              "allOf": [
                {
                  "$ref": "#/components/schemas/PaginationResponseDto"
                }
              ]
            },
            "tags": {
              "description": "List of tags",
              "type": "array",
              "items": {
                "$ref": "#/components/schemas/TagResponseDto"
              }
            }
          },
          "required": [
            "tags"
          ]
        },
        "TagCreateDto": {
          "type": "object",
          "properties": {
            "title": {
              "type": "string",
              "description": "Tag title"
            },
            "hotkey": {
              "type": "number",
              "description": "Hotkey, integer 65–90 (ASCII A–Z), excluding 84 (T)"
            },
            "parent": {
              "type": "string",
              "pattern": "^(?:A)-",
              "format": "singularity-id",
              "example": "A-123e4567-e89b-12d3-a456-426614174000",
              "description": "Parent tag, must start with A- (e.g. A-abc-123)"
            },
            "parentOrder": {
              "type": "number",
              "description": "Order in parent tag"
            },
            "color": {
              "type": "string",
              "description": "Tag color, valid hex color (e.g. #FF0000)"
            }
          },
          "required": [
            "title"
          ]
        },
        "TagUpdateDto": {
          "type": "object",
          "properties": {
            "title": {
              "type": "string",
              "description": "Tag title"
            },
            "hotkey": {
              "type": "number",
              "description": "Hotkey, integer 65–90 (ASCII A–Z), excluding 84 (T)"
            },
            "parent": {
              "type": "string",
              "pattern": "^(?:A)-",
              "format": "singularity-id",
              "example": "A-123e4567-e89b-12d3-a456-426614174000",
              "description": "Parent tag, must start with A- (e.g. A-abc-123)"
            },
            "parentOrder": {
              "type": "number",
              "description": "Order in parent tag"
            },
            "color": {
              "type": "string",
              "description": "Tag color, valid hex color (e.g. #FF0000)"
            }
          },
          "required": [
            "title"
          ]
        },
        "TimeStatListDto": {
          "type": "object",
          "properties": {
            "maxCount": {
              "type": "number",
              "description": "Maximum count, integer 1–1000",
              "maximum": 1000
            },
            "offset": {
              "type": "number",
              "description": "Offset for pagination, integer ≥ 0",
              "minimum": 0
            },
            "modifiedSince": {
              "type": "string",
              "description": "Return entities modified since the given sync timestamp (full ISO datetime with time component, e.g. 2026-07-01T00:00:00.000Z). Offsets like +03:00 are accepted and normalized to UTC Z before comparison."
            },
            "paginationData": {
              "type": "boolean",
              "description": "Include `pagination` block in response with `total/count/offset`. Default `false`.",
              "default": false
            },
            "date": {
              "type": "string",
              "description": "Filter by date"
            },
            "relatedTaskId": {
              "type": "string",
              "pattern": "^(?:T)-",
              "format": "singularity-id",
              "example": "T-123e4567-e89b-12d3-a456-426614174000",
              "description": "Filter by related task ID, must start with T-"
            }
          }
        },
        "TimeStatResponseDto": {
          "type": "object",
          "properties": {
            "id": {
              "type": "string",
              "description": "TimeStat ID"
            },
            "start": {
              "type": "string",
              "description": "Start date"
            },
            "end": {
              "type": "string",
              "description": "End date"
            },
            "secondsPassed": {
              "type": "number",
              "description": "Duration in seconds"
            },
            "quantity": {
              "type": "number",
              "description": "Quantity"
            },
            "relatedTaskId": {
              "type": "string",
              "description": "Related task ID"
            },
            "outdated": {
              "type": "boolean",
              "description": "Outdated flag"
            },
            "source": {
              "type": "number",
              "description": "Source type (0 = pomodoro, 1 = stopwatch)",
              "enum": [
                0,
                1
              ]
            },
            "modificatedDate": {
              "type": "string",
              "description": "Modification date"
            },
            "removed": {
              "type": "boolean",
              "description": "Removed flag"
            }
          },
          "required": [
            "id",
            "start",
            "end",
            "secondsPassed"
          ]
        },
        "TimeStatListResponseDto": {
          "type": "object",
          "properties": {
            "pagination": {
              "description": "Pagination metadata",
              "allOf": [
                {
                  "$ref": "#/components/schemas/PaginationResponseDto"
                }
              ]
            },
            "timeStats": {
              "description": "List of time stats",
              "type": "array",
              "items": {
                "$ref": "#/components/schemas/TimeStatResponseDto"
              }
            }
          },
          "required": [
            "timeStats"
          ]
        },
        "TimeStatCreateDto": {
          "type": "object",
          "properties": {
            "start": {
              "type": "string",
              "description": "Start date (ISO 8601 format or YYYY-MM-DD)"
            },
            "secondsPassed": {
              "type": "number",
              "description": "Duration in seconds"
            },
            "relatedTaskId": {
              "type": "string",
              "pattern": "^(?:T)-",
              "format": "singularity-id",
              "example": "T-123e4567-e89b-12d3-a456-426614174000",
              "description": "Related task ID, must start with T- (e.g. T-abc-123)"
            },
            "source": {
              "type": "number",
              "description": "Source type as an integer: 0 = POMODORO, 1 = STOPWATCH (default). Send the number, not the name. Required when `secondsPassed` is provided: limits depend on source (POMODORO ≤ 7200s, STOPWATCH ≤ 86400s).",
              "enum": [
                0,
                1
              ],
              "example": 1
            }
          },
          "required": [
            "start",
            "secondsPassed"
          ]
        },
        "TimeStatUpdateDto": {
          "type": "object",
          "properties": {
            "start": {
              "type": "string",
              "description": "Start date (ISO 8601 format or YYYY-MM-DD)"
            },
            "secondsPassed": {
              "type": "number",
              "description": "Duration in seconds"
            },
            "relatedTaskId": {
              "type": "string",
              "pattern": "^(?:T)-",
              "format": "singularity-id",
              "example": "T-123e4567-e89b-12d3-a456-426614174000",
              "description": "Related task ID, must start with T- (e.g. T-abc-123)"
            },
            "source": {
              "type": "number",
              "description": "Source type as an integer: 0 = POMODORO, 1 = STOPWATCH. Send the number, not the name. Required when `secondsPassed` is provided: limits depend on source (POMODORO ≤ 7200s, STOPWATCH ≤ 86400s).",
              "enum": [
                0,
                1
              ],
              "example": 1
            }
          }
        },
        "TimeStatDeleteBulkResponseDto": {
          "type": "object",
          "properties": {
            "deletedCount": {
              "type": "number",
              "description": "Number of deleted records"
            }
          },
          "required": [
            "deletedCount"
          ]
        },
        "BatchOperationDto": {
          "type": "object",
          "properties": {
            "method": {
              "type": "string",
              "enum": [
                "POST",
                "PATCH",
                "DELETE"
              ]
            },
            "path": {
              "type": "string",
              "description": "REST path starting with /v2/"
            },
            "body": {
              "type": "object",
              "description": "Operation body. Presence is validated by target batch endpoint descriptor.",
              "additionalProperties": true
            },
            "uuid": {
              "type": "string",
              "description": "Client operation UUID for idempotency"
            },
            "tempId": {
              "type": "string",
              "description": "Temporary identifier for cross-operation references"
            }
          },
          "required": [
            "method",
            "path"
          ]
        },
        "BatchRequestDto": {
          "type": "object",
          "properties": {
            "operations": {
              "type": "array",
              "items": {
                "$ref": "#/components/schemas/BatchOperationDto"
              }
            }
          },
          "required": [
            "operations"
          ]
        },
        "BatchOperationResultDto": {
          "type": "object",
          "properties": {
            "uuid": {
              "type": "string",
              "description": "Operation UUID from request"
            },
            "status": {
              "type": "number",
              "description": "HTTP status code of operation result"
            },
            "body": {
              "type": "object",
              "description": "Operation response body or error object",
              "additionalProperties": true
            }
          },
          "required": [
            "status"
          ]
        },
        "BatchResponseDto": {
          "type": "object",
          "properties": {
            "results": {
              "type": "array",
              "items": {
                "$ref": "#/components/schemas/BatchOperationResultDto"
              }
            },
            "tempIdMap": {
              "type": "object",
              "description": "Mapping of tempId to real entity id for successful create operations",
              "additionalProperties": {
                "type": "string"
              }
            }
          },
          "required": [
            "results"
          ]
        }
      }
    }
  },
  "customOptions": {}
};
  url = options.swaggerUrl || url
  let urls = options.swaggerUrls
  let customOptions = options.customOptions
  let spec1 = options.swaggerDoc
  let swaggerOptions = {
    spec: spec1,
    url: url,
    urls: urls,
    dom_id: '#swagger-ui',
    deepLinking: true,
    presets: [
      SwaggerUIBundle.presets.apis,
      SwaggerUIStandalonePreset
    ],
    plugins: [
      SwaggerUIBundle.plugins.DownloadUrl
    ],
    layout: "StandaloneLayout"
  }
  for (let attrname in customOptions) {
    swaggerOptions[attrname] = customOptions[attrname];
  }
  let ui = SwaggerUIBundle(swaggerOptions)

  if (customOptions.initOAuth) {
    ui.initOAuth(customOptions.initOAuth)
  }

  if (customOptions.authAction) {
    ui.authActions.authorize(customOptions.authAction)
  }
  
  window.ui = ui
}
