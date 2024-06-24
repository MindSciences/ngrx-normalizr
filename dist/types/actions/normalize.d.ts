/**
 * Exports actions and an actionCreators creator of the ngrx-normalizr package.
 */
import { Action } from '@ngrx/store';
import { schema } from 'normalizr';
import { EntityMap } from '../reducers/normalize';
/**
 * A map of schema names to object property names.
 * Used for removing child properties of an entity.
 */
export interface SchemaMap {
    [schemaKey: string]: string;
}
/**
 * Interface for a normalize action payload
 */
export interface NormalizeActionPayload {
    /**
     * The normalized entities mapped to their schema keys
     */
    entities: EntityMap;
    /**
     * The original sorted id's as an array
     */
    result: string[];
}
/**
 * Interface for a normalize action payload
 */
export interface NormalizeClearActionPayload {
    /**
     * The normalized schema key
     */
    schemaKey: string;
}
/**
 * Interface for a remove action payload
 */
export interface NormalizeRemoveActionPayload {
    /**
     * The id of the entity that should be removed
     */
    id: string;
    /**
     * The schema key of the entity that should be removed
     */
    key: string;
    /**
     * If maps valid schema keys to propety names,
     * children referenced by the schema key will be removed by its id
     */
    removeChildren: SchemaMap | null;
}
/**
 * Base interface for `AddData`, and `RemoveData` action payload.
 */
export interface NormalizeActionSchemaConfig {
    /**
     * Schema definition of the entity. Used for de-/ and normalizing given entities.
     */
    schema: schema.Entity;
}
/**
 * Base interface for AddChildData` and `RemoveChildData` action payload.
 */
export interface NormalizeChildActionSchemaConfig {
    /**
     * Schema definition of the entity. Used for de-/ and normalizing given entities.
     */
    parentSchema: NormalizeActionSchemaConfig['schema'];
}
/**
 * Typed Interface for the config of the `AddData` and `SetData` action.
 * Holds an typed array of entities to be added to the store.
 */
export interface NormalizeActionConfig<T> extends NormalizeActionSchemaConfig {
    /**
     * The array of entities which should be normalized and added to the store.
     */
    data: T[];
}
/**
 * Typed Interface for the config of the `AddData` and `SetData` action.
 * Holds an typed array of entities to be added to the store.
 */
export interface NormalizeUpdateActionConfig<T> extends NormalizeActionSchemaConfig {
    /**
     * The id of the entity to update
     */
    id: NormalizeRemoveActionPayload['id'];
    /**
     * Data to set in the entity
     */
    changes: Partial<T>;
}
/**
 * Typed Interface for the config of the `AddChildData` action.
 * Holds an typed array of entities to be added to the store.
 */
export interface NormalizeChildActionConfigBase<T> extends NormalizeChildActionSchemaConfig {
    /**
     * The array of entities which should be normalized and added to the store.
     */
    data: T[];
}
/**
 * Interface for child data related actions
 */
export interface NormalizeChildActionPayload extends NormalizeActionPayload {
    /**
     * The id of the parent entity
     */
    parentId: string;
    /**
     * Key of the parent's property which holds the child references
     */
    parentProperty: string;
    /**
     * Schema key of the parent's property
     */
    parentSchemaKey: string;
}
/**
 * Interface for the payload of the `RemoveChildAction`
 */
export interface NormalizeRemoveChildActionPayload {
    /**
     * The id of the entity that should be removed
     */
    id: NormalizeRemoveActionPayload['id'];
    /**
     * The key of the child schema
     */
    childSchemaKey: string;
    /**
     * The id of the parent entity
     */
    parentId: NormalizeChildActionPayload['parentId'];
    /**
     * Key of the parent's property which holds the child references
     */
    parentProperty: NormalizeChildActionPayload['parentProperty'];
    /**
     * Schema key of the parent's property
     */
    parentSchemaKey: NormalizeChildActionPayload['parentSchemaKey'];
}
/**
 * Interface for the payload of the `RemoveData` action.
 * Accepts an `id` and an optional `removeChildren` property.
 */
export interface NormalizeRemoveActionConfig extends NormalizeActionSchemaConfig {
    /**
     * The id of the entity that should be removed
     */
    id: NormalizeRemoveActionPayload['id'];
    /**
     * If maps valid schema keys to propety names,
     * children referenced by the schema key will be removed by its id
     */
    removeChildren?: NormalizeRemoveActionPayload['removeChildren'];
}
/**
 * Interface for the payload of the `AddChildData` action.
 */
export interface NormalizeChildActionConfig<T> extends NormalizeChildActionConfigBase<T> {
    /**
     * The schema of the child data to add
     */
    childSchema: schema.Entity;
    /**
     * The id of the parent entity
     */
    parentId: NormalizeChildActionPayload['parentId'];
}
/**
 * Interface for the payload of the `RemoveData` action.
 * Accepts an `id` and an optional `removeChildren` property.
 */
export interface NormalizeRemoveChildActionConfig extends NormalizeChildActionSchemaConfig {
    /**
     * The id of the entity that should be removed
     */
    id: NormalizeRemoveActionPayload['id'];
    /**
     * The schema of the child data to add
     */
    childSchema: schema.Entity;
    /**
     * The id of the parent entity
     */
    parentId: NormalizeChildActionPayload['parentId'];
}
/**
 * Payload of the `UpdateAction`
 */
export interface NormalizeUpdateActionPayload<T> {
    /**
     * The id of the entity that should be removed
     */
    id: NormalizeUpdateActionConfig<T>['id'];
    /**
     * Schema key of the entity to update
     */
    key: string;
    /**
     * The data to set in the entity
     */
    changes: EntityMap;
    /**
     * The original sorted id's as an array
     */
    result: string[];
}
/**
 * Interface for result for the `actionCreators` function
 */
export interface NormalizeActionCreators<T> {
    /**
     * Action creator for the `SetData` action
     */
    setData: (data: NormalizeActionConfig<T>['data']) => SetData<T>;
    /**
     * Action creator for the `AddData` action
     */
    addData: (data: NormalizeActionConfig<T>['data']) => AddData<T>;
    /**
     * Action creator for the `AddChildData` action
     */
    addChildData: <C>(data: NormalizeChildActionConfig<C>['data'], childSchema: NormalizeChildActionConfig<C>['childSchema'], parentId: NormalizeChildActionConfig<C>['parentId']) => AddChildData<C>;
    /**
     * Action creator for the `AddChildData` action
     */
    updateData: (id: NormalizeUpdateActionConfig<T>['id'], changes: NormalizeUpdateActionConfig<T>['changes']) => UpdateData<T>;
    /**
     * Action creator for the `removeData` action
     */
    removeData: (id: NormalizeRemoveActionConfig['id'], removeChildren?: NormalizeRemoveActionConfig['removeChildren']) => RemoveData;
    /**
     * Action creator for the `AddChildData` action
     */
    removeChildData: (id: NormalizeRemoveChildActionConfig['id'], childSchema: NormalizeRemoveChildActionConfig['childSchema'], parentId: NormalizeRemoveChildActionConfig['parentId']) => RemoveChildData;
}
/**
 * All types of the provided actions.
 */
export declare class NormalizeActionTypes {
    /**
     * Action type of the `SetData` action.
     */
    static readonly CLEAR_DATA: string;
    /**
     * Action type of the `SetData` action.
     */
    static readonly SET_DATA: string;
    /**
     * Action type of the `AddData` action.
     */
    static readonly ADD_DATA: string;
    /**
     * Action type of the `AddChildData` action.
     */
    static readonly ADD_CHILD_DATA: string;
    /**
     * Action type of the `UpdateData` action
     */
    static readonly UPDATE_DATA: string;
    /**
     * Action type of the `RemoveData` action.
     */
    static readonly REMOVE_DATA: string;
    /**
     * Action type of the `RemoveChildData` action.
     */
    static readonly REMOVE_CHILD_DATA: string;
}
/**
 * Action for settings denormalized entities in the store.
 * Also see `NormalizeClearActionPayload`.
 */
export declare class ClearData implements Action {
    /**
     * The action type: `NormalizeActionTypes.CLEAR_DATA`
     */
    readonly type: string;
    /**
     * The payload will be an object of the normalized entity map as `entities`
     * and the original sorted id's as an array in the `result` property.
     */
    payload: NormalizeClearActionPayload;
    /**
     * SetData Constructor
     * @param config The action config object
     */
    constructor(config: NormalizeActionSchemaConfig);
}
/**
 * Action for settings denormalized entities in the store.
 * Also see `NormalizeDataPayload`.
 */
export declare class SetData<T> implements Action {
    /**
     * The action type: `NormalizeActionTypes.SET_DATA`
     */
    readonly type: string;
    /**
     * The payload will be an object of the normalized entity map as `entities`
     * and the original sorted id's as an array in the `result` property.
     */
    payload: NormalizeActionPayload;
    /**
     * SetData Constructor
     * @param config The action config object
     */
    constructor(config: NormalizeActionConfig<T>);
}
/**
 * Action for adding/updating data to the store.
 * Also see `NormalizeDataPayload`.
 */
export declare class AddData<T> implements Action {
    /**
     * The action type: `NormalizeActionTypes.ADD_DATA`
     */
    readonly type: string;
    /**
     * The payload will be an object of the normalized entity map as `entities`
     * and the original sorted id's as an array in the `result` property.
     */
    payload: NormalizeActionPayload;
    /**
     * AddData Constructor
     * @param config The action config object
     */
    constructor(config: NormalizeActionConfig<T>);
}
/**
 * Action for adding/updating data to the store.
 * Also see `NormalizeDataPayload`.
 */
export declare class AddChildData<T> implements Action {
    /**
     * The action type: `NormalizeActionTypes.ADD_CHILD_DATA`
     */
    readonly type: string;
    /**
     * The payload will be an object of the normalized entity map as `entities`
     * and the original sorted id's as an array in the `result` property.
     */
    payload: NormalizeChildActionPayload;
    /**
     * AddData Constructor
     * @param config The action config object
     */
    constructor(config: NormalizeChildActionConfig<T>);
}
/**
 * Action for adding/updating data to the store.
 * Also see `NormalizeDataPayload`.
 */
export declare class UpdateData<T> implements Action {
    /**
     * The action type: `NormalizeActionTypes.UPDATE_DATA`
     */
    readonly type: string;
    /**
     * The payload will be an object of the normalized entity map as `entities`
     * and the original sorted id's as an array in the `result` property.
     */
    payload: NormalizeUpdateActionPayload<T>;
    /**
     * AddData Constructor
     * @param config The action config object
     */
    constructor(config: NormalizeUpdateActionConfig<T>);
}
/**
 * Action for removing data from the store.
 * Also see `NormalizeRemovePayload`.
 */
export declare class RemoveData implements Action {
    /**
     * The action type: `NormalizeActionTypes.REMOVE_DATA`
     */
    readonly type: string;
    /**
     * The payload will be an object of the normalized entity map as `entities`
     * and the original sorted id's as an array in the `result` property.
     */
    payload: NormalizeRemoveActionPayload;
    /**
     * RemoveData Constructor
     * @param payload The action payload used in the reducer
     */
    constructor(config: NormalizeRemoveActionConfig);
}
/**
 * Action for removing data from the store.
 * Also see `NormalizeRemovePayload`.
 */
export declare class RemoveChildData implements Action {
    /**
     * The action type: `NormalizeActionTypes.REMOVE_CHILD_DATA`
     */
    readonly type: string;
    /**
     * The payload will be an object of the normalized entity map as `entities`
     * and the original sorted id's as an array in the `result` property.
     */
    payload: NormalizeRemoveChildActionPayload;
    /**
     * RemoveData Constructor
     * @param payload The action payload used in the reducer
     */
    constructor(config: NormalizeRemoveChildActionConfig);
}
/**
 * Create a add of action creators for the `AddData` and `RemoveData` actions.
 * This is provided for convenience.
 * @param schema The schema the action creators should be bound to
 */
export declare function actionCreators<T>(schema: schema.Entity): NormalizeActionCreators<T>;
//# sourceMappingURL=normalize.d.ts.map