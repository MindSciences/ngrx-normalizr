import { normalize } from 'normalizr';
const ACTION_NAMESPACE = '[@@Normalize]';
export class NormalizeActionTypes {
}
NormalizeActionTypes.CLEAR_DATA = `${ACTION_NAMESPACE} Clear Data`;
NormalizeActionTypes.SET_DATA = `${ACTION_NAMESPACE} Set Data`;
NormalizeActionTypes.ADD_DATA = `${ACTION_NAMESPACE} Add Data`;
NormalizeActionTypes.ADD_CHILD_DATA = `${ACTION_NAMESPACE} Add Child Data`;
NormalizeActionTypes.UPDATE_DATA = `${ACTION_NAMESPACE} Update Data`;
NormalizeActionTypes.REMOVE_DATA = `${ACTION_NAMESPACE} Remove Data`;
NormalizeActionTypes.REMOVE_CHILD_DATA = `${ACTION_NAMESPACE} Remove Child Data`;
export class ClearData {
    constructor(config) {
        this.type = NormalizeActionTypes.CLEAR_DATA;
        this.payload = { schemaKey: config.schema.key };
    }
}
export class SetData {
    constructor(config) {
        this.type = NormalizeActionTypes.SET_DATA;
        this.payload = normalize(config.data, [config.schema]);
        if (!this.payload.entities[config.schema.key]) {
            this.payload.entities[config.schema.key] = [];
        }
    }
}
export class AddData {
    constructor(config) {
        this.type = NormalizeActionTypes.ADD_DATA;
        this.payload = normalize(config.data, [config.schema]);
    }
}
export class AddChildData {
    constructor(config) {
        this.type = NormalizeActionTypes.ADD_CHILD_DATA;
        const { data, parentSchema, parentId, childSchema } = config;
        this.payload = Object.assign(Object.assign({}, normalize(data, [childSchema])), { parentSchemaKey: parentSchema.key, parentProperty: getRelationProperty(parentSchema, childSchema), parentId });
    }
}
export class UpdateData {
    constructor(config) {
        this.type = NormalizeActionTypes.UPDATE_DATA;
        const { id, schema, changes } = config;
        changes[schema._idAttribute] = id;
        const normalized = normalize([config.changes], [config.schema]);
        this.payload = {
            id,
            key: schema.key,
            changes: normalized.entities,
            result: normalized.result
        };
    }
}
export class RemoveData {
    constructor(config) {
        this.type = NormalizeActionTypes.REMOVE_DATA;
        let { id, removeChildren, schema } = config;
        let removeMap = null;
        if (removeChildren && schema.schema) {
            removeMap = Object.entries(removeChildren).reduce((p, [key, entityProperty]) => {
                if (entityProperty in schema.schema) {
                    p[key] = entityProperty;
                }
                return p;
            }, {});
        }
        this.payload = {
            id,
            key: schema.key,
            removeChildren: removeMap && Object.keys(removeMap).length ? removeMap : null
        };
    }
}
export class RemoveChildData {
    constructor(config) {
        this.type = NormalizeActionTypes.REMOVE_CHILD_DATA;
        let { id, parentSchema, childSchema, parentId } = config;
        this.payload = {
            id,
            childSchemaKey: childSchema.key,
            parentProperty: getRelationProperty(parentSchema, childSchema),
            parentSchemaKey: parentSchema.key,
            parentId
        };
    }
}
export function actionCreators(schema) {
    return {
        setData: (data) => new SetData({ data, schema }),
        addData: (data) => new AddData({ data, schema }),
        addChildData: (data, childSchema, parentId) => new AddChildData({
            data,
            parentSchema: schema,
            childSchema,
            parentId
        }),
        updateData: (id, changes) => new UpdateData({ id, schema, changes }),
        removeData: (id, removeChildren) => new RemoveData({ id, schema, removeChildren }),
        removeChildData: (id, childSchema, parentId) => new RemoveChildData({ id, parentSchema: schema, childSchema, parentId })
    };
}
function getRelationProperty(schema, childSchema) {
    let parentProperty = null;
    const relations = schema.schema;
    if (relations) {
        Object.keys(relations).some(k => {
            let key = Array.isArray(relations[k])
                ? relations[k][0].key
                : relations[k].key;
            if (key === childSchema.key) {
                parentProperty = k;
                return true;
            }
        });
    }
    return parentProperty;
}
//# sourceMappingURL=normalize.js.map