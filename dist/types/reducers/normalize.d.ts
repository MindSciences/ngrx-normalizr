/**
 * Exports reducers and selectors of the ngrx-normalizr package.
 */
import { MemoizedSelector } from '@ngrx/store';
import { schema } from 'normalizr';
/**
 * Interface describing the entities propery of a normalized state.
 * A map of schema keys wich map to a map of entity id's to entity data.
 * This corresponds to the `entities` property of a `normalizr.normalize` result.
 */
export interface EntityMap {
    [key: string]: {
        [id: string]: any;
    };
}
/**
 * The state interface from which the app state should extend.
 * Holds an instance of `NormalizedEntityState` itself.
 */
export interface NormalizedState {
    /** The normalized state property */
    normalized: NormalizedEntityState;
}
/**
 * The normalized state, representing a `normalizr.normalize` result.
 * Can be selected by the provided `getNormalizedEntities` and `getResult`
 * selectors.
 */
export interface NormalizedEntityState {
    /**
     * The original sorting of the unnormalized data.
     * Holds all id's of the last set operation in original order.
     * Can be used to restore the original sorting of entities
     */
    result: string[];
    /**
     * The normalized entities. Should be passed to all projector functions
     * to enable access to all entities needed.
     */
    entities: EntityMap;
}
/**
 * The normalizing reducer function which will handle actions with the types
 * `NormalizeActionTypes.SET_DATA`, `NormalizeActionTypes.ADD_DATA` and `NormalizeActionTypes.REMOVE_DATA`.
 *
 * On an `NormalizeActionTypes.SET_DATA` action:
 *
 * All entities and childs of the given schema will be replaced with the new entities.
 *
 * On an `NormalizeActionTypes.CLEAR_DATA` action:
 *
 * All entities of the given schema will be removed.
 *
 * On an `NormalizeActionTypes.ADD_DATA` action:
 *
 * Entities are identified by their id attribute set in the schema passed by the payload.
 * Existing entities will be overwritten by updated data, new entities will be added to the store.
 *
 * On an `NormalizeActionTypes.REMOVE_DATA` action:
 *
 * Entities are identified by their id attribute set in the schema passed by the payload.
 * The entity with the passed id will be removed. If a `removeChildren` option is set in the action
 * payload, it is assumed as a map of schema keys to object property names. All referenced children
 * of the entity will be read by the object propety name and removed by the schema key.
 *
 * @param state The current state
 * @param action The dispatched action, one of `NormalizeActionTypes.ADD_DATA` or `NormalizeActionTypes.REMOVE_DATA`.
 */
export declare function normalized(state: NormalizedEntityState, action: any): {
    result: any;
    entities: any;
};
/**
 * Selects all normalized entities of the state, regardless of their schema.
 * This selector should be used to enable denormalizing projector functions access
 * to all needed schema entities.
 */
export declare const getNormalizedEntities: MemoizedSelector<any, EntityMap>;
/**
 * Select the result order of the last set operation.
 */
export declare const getResult: MemoizedSelector<any, string[]>;
/**
 * Generic interface for `createSchemaSelectors` return type.
 */
export interface SchemaSelectors<T> {
    getNormalizedEntities: MemoizedSelector<any, EntityMap>;
    getEntities: MemoizedSelector<{}, T[]>;
    entityProjector: (entities: {}, id: string) => T;
    entitiesProjector: (entities: {}) => T[];
}
/**
 * Creates an object of selectors and projector functions bound to the given schema.
 * @param schema The schema to bind the selectors and projectors to
 */
export declare function createSchemaSelectors<T>(schema: schema.Entity): SchemaSelectors<T>;
//# sourceMappingURL=normalize.d.ts.map