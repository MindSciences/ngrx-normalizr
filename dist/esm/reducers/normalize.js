import { createSelector } from '@ngrx/store';
import { denormalize } from 'normalizr';
import { NormalizeActionTypes } from '../actions/normalize';
const STATE_KEY = 'normalized';
const initialState = {
    result: [],
    entities: {}
};
export function normalized(state = initialState, action) {
    switch (action.type) {
        case NormalizeActionTypes.SET_DATA: {
            const { result, entities } = action.payload;
            return {
                result,
                entities: Object.assign(Object.assign({}, state.entities), entities)
            };
        }
        case NormalizeActionTypes.CLEAR_DATA: {
            const { schemaKey } = action.payload;
            return {
                result: [],
                entities: Object.assign(Object.assign({}, state.entities), { [schemaKey]: {} })
            };
        }
        case NormalizeActionTypes.ADD_DATA: {
            const { result, entities } = action.payload;
            return {
                result,
                entities: Object.keys(entities).reduce((p, c) => {
                    p[c] = Object.assign(Object.assign({}, p[c]), entities[c]);
                    return p;
                }, Object.assign({}, state.entities))
            };
        }
        case NormalizeActionTypes.ADD_CHILD_DATA: {
            const { result, entities, parentSchemaKey, parentProperty, parentId } = action.payload;
            const newEntities = Object.assign({}, state.entities);
            if (getParentReferences(newEntities, action.payload)) {
                newEntities[parentSchemaKey][parentId][parentProperty].push(...result);
            }
            return {
                result,
                entities: Object.keys(entities).reduce((p, c) => {
                    p[c] = Object.assign(Object.assign({}, p[c]), entities[c]);
                    return p;
                }, newEntities)
            };
        }
        case NormalizeActionTypes.UPDATE_DATA: {
            const { id, key, changes, result } = action.payload;
            if (!state.entities[key] || !state.entities[key][id]) {
                return state;
            }
            const newEntities = Object.assign({}, state.entities);
            Object.entries(changes).forEach(([key, value]) => {
                Object.entries(changes[key]).forEach(([id, obj]) => {
                    newEntities[key][id] = newEntities[key][id] || {};
                    Object.entries(changes[key][id]).forEach(([property, value]) => {
                        if (Array.isArray(value)) {
                            newEntities[key][id][property].push(...value);
                        }
                        else {
                            newEntities[key][id][property] = value;
                        }
                    });
                });
            });
            return {
                result,
                entities: newEntities
            };
        }
        case NormalizeActionTypes.REMOVE_DATA: {
            const { id, key, removeChildren } = action.payload;
            const entities = Object.assign({}, state.entities);
            const entity = entities[key][id];
            if (!entity) {
                return state;
            }
            if (removeChildren) {
                Object.entries(removeChildren).map(([key, entityProperty]) => {
                    const child = entity[entityProperty];
                    if (child && entities[key]) {
                        const ids = Array.isArray(child) ? child : [child];
                        ids.forEach((oldId) => delete entities[key][oldId]);
                    }
                });
            }
            delete entities[key][id];
            return {
                result: state.result,
                entities
            };
        }
        case NormalizeActionTypes.REMOVE_CHILD_DATA: {
            const { id, childSchemaKey, parentProperty, parentSchemaKey, parentId } = action.payload;
            const newEntities = Object.assign({}, state.entities);
            const entity = newEntities[childSchemaKey][id];
            if (!entity) {
                return state;
            }
            const parentRefs = getParentReferences(newEntities, action.payload);
            if (parentRefs && parentRefs.indexOf(id) > -1) {
                newEntities[parentSchemaKey][parentId][parentProperty].splice(parentRefs.indexOf(id), 1);
            }
            delete newEntities[childSchemaKey][id];
            return Object.assign(Object.assign({}, state), { entities: newEntities });
        }
        default:
            return state;
    }
}
const getNormalizedState = (state) => state[STATE_KEY];
export const getNormalizedEntities = createSelector(getNormalizedState, (state) => state.entities);
export const getResult = createSelector(getNormalizedState, (state) => state.result);
export function createSchemaSelectors(schema) {
    return {
        getNormalizedEntities,
        getEntities: createEntitiesSelector(schema),
        entityProjector: createEntityProjector(schema),
        entitiesProjector: createEntitiesProjector(schema)
    };
}
function createEntitiesSelector(schema) {
    return createSelector(getNormalizedEntities, createEntitiesProjector(schema));
}
function createEntityProjector(schema) {
    return (entities, id) => createSingleDenormalizer(schema)(entities, id);
}
function createEntitiesProjector(schema) {
    return (entities, ids) => createMultipleDenormalizer(schema)(entities, ids);
}
function createSingleDenormalizer(schema) {
    const key = schema.key;
    return (entities, id) => {
        if (!entities || !entities[key]) {
            return;
        }
        const denormalized = denormalize({ [key]: [id] }, { [key]: [schema] }, entities);
        return denormalized[key][0];
    };
}
function createMultipleDenormalizer(schema) {
    const key = schema.key;
    return (entities, ids) => {
        if (!entities || !entities[key]) {
            return;
        }
        const data = ids ? { [key]: ids } : { [key]: Object.keys(entities[key]) };
        const denormalized = denormalize(data, { [key]: [schema] }, entities);
        return denormalized[key];
    };
}
function getParentReferences(entities, payload) {
    const { parentSchemaKey, parentProperty, parentId } = payload;
    if (entities[parentSchemaKey] &&
        entities[parentSchemaKey][parentId] &&
        entities[parentSchemaKey][parentId][parentProperty] &&
        Array.isArray(entities[parentSchemaKey][parentId][parentProperty])) {
        return entities[parentSchemaKey][parentId][parentProperty];
    }
}
//# sourceMappingURL=normalize.js.map