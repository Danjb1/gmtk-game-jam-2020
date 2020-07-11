import { Entity } from './entity';

/**
 * Describes a context for Entities to exist in, with the ability to access the
 * other Entities in the context.
 */
export interface EntityContext {
  getEntities: () => Entity[];
}
