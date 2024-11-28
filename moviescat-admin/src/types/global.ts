import { IMovie } from "./movie";

export type TypeModal = "create" | "update" | "delete"
;
export interface IModalContext {
    objectData: IMovie | null;
    setObjectData: (movie: IMovie) => void;
}