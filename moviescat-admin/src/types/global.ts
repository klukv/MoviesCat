import { IMovie, IMovieWithoutId } from "./movie";

export type TypeModal = "create" | "update" | "delete";

export enum ModalContextTypes {
    CREATE = 'CREATE',
    EDIT = 'EDIT',
    DELETE = 'DELETE'
}

export interface MovieEditOptions {
    movieId: number;
    changingField: string;
    value: string,
}


export interface IModalContextCreateData {
    type: ModalContextTypes.CREATE,
    objectData: IMovieWithoutId | null;
    setObjectData: (movie: IMovieWithoutId) => void;
}

export interface IModalContextEditData {
    type: ModalContextTypes.EDIT,
    movieEditOption: MovieEditOptions | null;
    setMovieEditOption: (options: MovieEditOptions) => void;
}

interface IModalRemoveData {
    type: ModalContextTypes.DELETE,
    selectRemovingId: number | null,
    setSelectRemovingId: (movie: number) => void;
}

export type IModalContext = IModalContextCreateData | IModalContextEditData | IModalRemoveData;