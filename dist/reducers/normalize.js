"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var store_1 = require("@ngrx/store");
var normalizr_1 = require("normalizr");
var normalize_1 = require("../actions/normalize");
var STATE_KEY = 'normalized';
var initialState = {
    result: [],
    entities: {}
};
function normalized(state, action) {
    if (state === void 0) { state = initialState; }
    var _a, _b;
    switch (action.type) {
        case normalize_1.NormalizeActionTypes.SET_DATA: {
            var _c = action.payload, result = _c.result, entities = _c.entities;
            return {
                result: result,
                entities: __assign({}, state.entities, entities)
            };
        }
        case normalize_1.NormalizeActionTypes.CLEAR_DATA: {
            var schemaKey = action.payload.schemaKey;
            return {
                result: [],
                entities: __assign({}, state.entities, (_a = {}, _a[schemaKey] = {}, _a))
            };
        }
        case normalize_1.NormalizeActionTypes.ADD_DATA: {
            var _d = action.payload, result = _d.result, entities_1 = _d.entities;
            return {
                result: result,
                entities: Object.keys(entities_1).reduce(function (p, c) {
                    p[c] = __assign({}, p[c], entities_1[c]);
                    return p;
                }, __assign({}, state.entities))
            };
        }
        case normalize_1.NormalizeActionTypes.ADD_CHILD_DATA: {
            var _e = action.payload, result = _e.result, entities_2 = _e.entities, parentSchemaKey = _e.parentSchemaKey, parentProperty = _e.parentProperty, parentId = _e.parentId;
            var newEntities = __assign({}, state.entities);
            if (getParentReferences(newEntities, action.payload)) {
                (_b = newEntities[parentSchemaKey][parentId][parentProperty]).push.apply(_b, result);
            }
            return {
                result: result,
                entities: Object.keys(entities_2).reduce(function (p, c) {
                    p[c] = __assign({}, p[c], entities_2[c]);
                    return p;
                }, newEntities)
            };
        }
        case normalize_1.NormalizeActionTypes.UPDATE_DATA: {
            var _f = action.payload, id = _f.id, key = _f.key, changes_1 = _f.changes, result = _f.result;
            if (!state.entities[key] || !state.entities[key][id]) {
                return state;
            }
            var newEntities_1 = __assign({}, state.entities);
            Object.entries(changes_1).forEach(function (_a) {
                var key = _a[0], value = _a[1];
                Object.entries(changes_1[key]).forEach(function (_a) {
                    var id = _a[0], obj = _a[1];
                    newEntities_1[key][id] = newEntities_1[key][id] || {};
                    Object.entries(changes_1[key][id]).forEach(function (_a) {
                        var property = _a[0], value = _a[1];
                        var _b;
                        if (Array.isArray(value)) {
                            (_b = newEntities_1[key][id][property]).push.apply(_b, value);
                        }
                        else {
                            newEntities_1[key][id][property] = value;
                        }
                    });
                });
            });
            return {
                result: result,
                entities: newEntities_1
            };
        }
        case normalize_1.NormalizeActionTypes.REMOVE_DATA: {
            var _g = action.payload, id = _g.id, key = _g.key, removeChildren = _g.removeChildren;
            var entities_3 = __assign({}, state.entities);
            var entity_1 = entities_3[key][id];
            if (!entity_1) {
                return state;
            }
            if (removeChildren) {
                Object.entries(removeChildren).map(function (_a) {
                    var key = _a[0], entityProperty = _a[1];
                    var child = entity_1[entityProperty];
                    if (child && entities_3[key]) {
                        var ids = Array.isArray(child) ? child : [child];
                        ids.forEach(function (oldId) { return delete entities_3[key][oldId]; });
                    }
                });
            }
            delete entities_3[key][id];
            return {
                result: state.result,
                entities: entities_3
            };
        }
        case normalize_1.NormalizeActionTypes.REMOVE_CHILD_DATA: {
            var _h = action.payload, id = _h.id, childSchemaKey = _h.childSchemaKey, parentProperty = _h.parentProperty, parentSchemaKey = _h.parentSchemaKey, parentId = _h.parentId;
            var newEntities = __assign({}, state.entities);
            var entity = newEntities[childSchemaKey][id];
            if (!entity) {
                return state;
            }
            var parentRefs = getParentReferences(newEntities, action.payload);
            if (parentRefs && parentRefs.indexOf(id) > -1) {
                newEntities[parentSchemaKey][parentId][parentProperty].splice(parentRefs.indexOf(id), 1);
            }
            delete newEntities[childSchemaKey][id];
            return __assign({}, state, { entities: newEntities });
        }
        default:
            return state;
    }
}
exports.normalized = normalized;
var getNormalizedState = function (state) {
    return state[STATE_KEY];
};
exports.getNormalizedEntities = store_1.createSelector(getNormalizedState, function (state) { return state.entities; });
exports.getResult = store_1.createSelector(getNormalizedState, function (state) { return state.result; });
function createSchemaSelectors(schema) {
    return {
        getNormalizedEntities: exports.getNormalizedEntities,
        getEntities: createEntitiesSelector(schema),
        entityProjector: createEntityProjector(schema),
        entitiesProjector: createEntitiesProjector(schema)
    };
}
exports.createSchemaSelectors = createSchemaSelectors;
function createEntitiesSelector(schema) {
    return store_1.createSelector(exports.getNormalizedEntities, createEntitiesProjector(schema));
}
function createEntityProjector(schema) {
    return function (entities, id) {
        return createSingleDenormalizer(schema)(entities, id);
    };
}
function createEntitiesProjector(schema) {
    return function (entities, ids) {
        return createMultipleDenormalizer(schema)(entities, ids);
    };
}
function createSingleDenormalizer(schema) {
    var key = schema.key;
    return function (entities, id) {
        var _a, _b;
        if (!entities || !entities[key]) {
            return;
        }
        var denormalized = normalizr_1.denormalize((_a = {}, _a[key] = [id], _a), (_b = {}, _b[key] = [schema], _b), entities);
        return denormalized[key][0];
    };
}
function createMultipleDenormalizer(schema) {
    var key = schema.key;
    return function (entities, ids) {
        var _a, _b, _c;
        if (!entities || !entities[key]) {
            return;
        }
        var data = ids ? (_a = {}, _a[key] = ids, _a) : (_b = {}, _b[key] = Object.keys(entities[key]), _b);
        var denormalized = normalizr_1.denormalize(data, (_c = {}, _c[key] = [schema], _c), entities);
        return denormalized[key];
    };
}
function getParentReferences(entities, payload) {
    var parentSchemaKey = payload.parentSchemaKey, parentProperty = payload.parentProperty, parentId = payload.parentId;
    if (entities[parentSchemaKey] &&
        entities[parentSchemaKey][parentId] &&
        entities[parentSchemaKey][parentId][parentProperty] &&
        Array.isArray(entities[parentSchemaKey][parentId][parentProperty])) {
        return entities[parentSchemaKey][parentId][parentProperty];
    }
}
