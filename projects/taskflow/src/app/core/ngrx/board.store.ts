import {
  createActionGroup,
  createFeature,
  createReducer,
  createSelector,
  emptyProps,
  on,
  props,
} from '@ngrx/store';
import { TaskFlowData } from '../db';
import { Board, Column, User } from '../models';

export interface BoardState {
  readonly users: readonly User[];
  readonly boards: readonly Board[];
  readonly columns: readonly Column[];
  readonly loaded: boolean;
}

export const initialBoardState: BoardState = {
  users: [],
  boards: [],
  columns: [],
  loaded: false,
};

/** Events, not commands: the name says what happened. */
export const BoardActions = createActionGroup({
  source: 'Boards',
  events: {
    Loaded: props<{ data: TaskFlowData }>(),
    Created: props<{ board: Board; columns: readonly Column[] }>(),
    Removed: props<{ boardId: string }>(),
    Reset: emptyProps(),
  },
});

export const boardReducer = createReducer(
  initialBoardState,
  on(BoardActions.loaded, (state, { data }) => ({
    users: data.users,
    boards: data.boards,
    columns: data.columns,
    loaded: true,
  })),
  on(BoardActions.created, (state, { board, columns }) => ({
    ...state,
    boards: [...state.boards, board],
    columns: [...state.columns, ...columns],
  })),
  on(BoardActions.removed, (state, { boardId }) => ({
    ...state,
    boards: state.boards.filter((board) => board.id !== boardId),
    columns: state.columns.filter((column) => column.boardId !== boardId),
  })),
);

export const boardsFeature = createFeature({
  name: 'boards',
  reducer: boardReducer,
  extraSelectors: ({ selectBoards, selectColumns, selectUsers }) => ({
    selectBoardById: (boardId: string) =>
      createSelector(selectBoards, (boards) => boards.find((board) => board.id === boardId)),
    selectColumnsOfBoard: (boardId: string) =>
      createSelector(selectColumns, (columns) =>
        columns
          .filter((column) => column.boardId === boardId)
          .slice()
          .sort((a, b) => a.order - b.order),
      ),
    selectUserById: (userId: string | undefined) =>
      createSelector(selectUsers, (users) =>
        userId ? users.find((user) => user.id === userId) : undefined,
      ),
  }),
});

export const {
  selectBoardsState,
  selectBoards,
  selectUsers,
  selectColumns,
  selectLoaded,
  selectBoardById,
  selectColumnsOfBoard,
  selectUserById,
} = boardsFeature;
