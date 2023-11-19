/// <reference types='react' />
/// <reference types='pouchdb' />
/// <reference types='pouchdb-core' />
/// <reference types='pouchdb-find' />

declare module "react-pouchdb" {
  interface PouchDBProps extends PouchDB.Configuration.DatabaseConfiguration {
    name: string;
    maxListeners?: number;
    children?: ReactNode;
  }
  export function PouchDB(props: PouchDBProps): JSX.Element;

  export function useDB(db?: string | PouchDBProps): PouchDB.Database;

  ///
  // useGet and Get

  interface GetOptions extends PouchDB.Core.GetOptions {
    attachments?: boolean | string;
  }
  type GetResult<Model> = (PouchDB.Core.Document<Model> & PouchDB.Core.GetMeta) | undefined | null;

  export function useGet<Model>(options: GetOptions): GetResult<Model>;
  export function useGet<Model>(db?: string | PouchDBProps, options: GetOptions): GetResult<Model>;

  interface GetProps extends GetOptions {
    db?: string | PouchDBProps;
    children: (props: { db: PouchDB.Database; doc: GetResult<Model> }) => JSX.Element;
  }
  export function Get(props: GetProps): JSX.Element;

  ///
  // useFind and Find

  type FindOptions = PouchDB.Find.FindRequest;
  type FindResult<Model> = PouchDB.Core.ExistingDocument<Model>[] | undefined;

  export function useFind<Model>(options: FindOptions): FindResult<Model>;
  export function useFind<Model>(db?: string | PouchDBProps, options: FindOptions): FindResult<Model>;

  interface FindProps extends FindOptions {
    db?: string | PouchDBProps;
    children: (props: { db: PouchDB.Database; docs: FindResult<Model> }) => JSX.Element;
  }
  export function Find(props: FindProps): JSX.Element;

  ///
  // useAllDocs and AllDocs

  type AllDocsOptions =
    | PouchDB.Core.AllDocsWithKeyOptions
    | PouchDB.Core.AllDocsWithKeysOptions
    | PouchDB.Core.AllDocsWithinRangeOptions
    | PouchDB.Core.AllDocsOptions;
  type AllDocsResult<Model> =
    | {
        doc?: PouchDB.Core.ExistingDocument<Model & PouchDB.Core.AllDocsMeta>;
        id: PouchDB.Core.DocumentId;
        key: PouchDB.Core.DocumentKey;
        value: {
          rev: PouchDB.Core.RevisionId;
          deleted?: boolean;
        };
      }[]
    | undefined;

  export function useAllDocs<Model>(options: AllDocsOptions): AllDocsResult<Model>;
  export function useAllDocs<Model>(db?: string | PouchDBProps, options: AllDocsOptions): AllDocsResult<Model>;

  interface AllDocsProps extends AllDocsOptions {
    db?: string | PouchDBProps;
    children: (props: { db: PouchDB.Database; rows: AllDocsResult<Model> }) => JSX.Element;
  }
  export function AllDocs(props: AllDocsProps): JSX.Element;
}
