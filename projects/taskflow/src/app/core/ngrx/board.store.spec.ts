import { BoardActions, boardReducer, boardsFeature, initialBoardState } from './board.store';
import { TaskFlowData } from '../db';
import { Board, Column } from '../models';

const COLUMNS: Column[] = [
  { id: 'c2', boardId: 'b_1', title: 'Done', status: 'done', order: 1 },
  { id: 'c1', boardId: 'b_1', title: 'To Do', status: 'todo', order: 0 },
  { id: 'c3', boardId: 'b_2', title: 'To Do', status: 'todo', order: 0 },
];

const BOARD: Board = {
  id: 'b_1',
  title: 'One',
  description: '',
  visibility: 'team',
  ownerId: 'u_1',
  columnIds: ['c1', 'c2'],
  createdAt: '2026-01-01',
};

const DATA: TaskFlowData = {
  users: [{ id: 'u_1', name: 'Ada', email: 'ada@taskflow.dev', role: 'admin' }],
  boards: [BOARD],
  columns: COLUMNS,
  tasks: [],
};

describe('boardReducer', () => {
  it('ignores unknown actions', () => {
    expect(boardReducer(initialBoardState, { type: 'nothing' })).toBe(initialBoardState);
  });

  it('replaces everything on loaded', () => {
    const state = boardReducer(initialBoardState, BoardActions.loaded({ data: DATA }));

    expect(state.boards).toEqual([BOARD]);
    expect(state.users).toHaveLength(1);
    expect(state.loaded).toBe(true);
  });

  it('appends a created board with its columns', () => {
    const loaded = boardReducer(initialBoardState, BoardActions.loaded({ data: DATA }));
    const newBoard: Board = { ...BOARD, id: 'b_9', title: 'Nine', columnIds: ['c9'] };
    const newColumns: Column[] = [
      { id: 'c9', boardId: 'b_9', title: 'To Do', status: 'todo', order: 0 },
    ];

    const state = boardReducer(
      loaded,
      BoardActions.created({ board: newBoard, columns: newColumns }),
    );

    expect(state.boards.map((board) => board.id)).toEqual(['b_1', 'b_9']);
    expect(state.columns).toHaveLength(4);
  });

  it('drops a removed board with its columns', () => {
    const loaded = boardReducer(initialBoardState, BoardActions.loaded({ data: DATA }));

    const state = boardReducer(loaded, BoardActions.removed({ boardId: 'b_1' }));

    expect(state.boards).toHaveLength(0);
    expect(state.columns.map((column) => column.id)).toEqual(['c3']);
  });

  it('is pure: the same input always gives the same output', () => {
    const action = BoardActions.loaded({ data: DATA });

    expect(boardReducer(initialBoardState, action)).toEqual(
      boardReducer(initialBoardState, action),
    );
    expect(initialBoardState.boards).toHaveLength(0);
  });
});

describe('board selectors', () => {
  const state = boardReducer(initialBoardState, BoardActions.loaded({ data: DATA }));

  it('finds a board by id', () => {
    expect(boardsFeature.selectBoardById('b_1').projector(state.boards)).toEqual(BOARD);
    expect(boardsFeature.selectBoardById('nope').projector(state.boards)).toBeUndefined();
  });

  it('returns the columns of a board in order', () => {
    expect(
      boardsFeature
        .selectColumnsOfBoard('b_1')
        .projector(state.columns)
        .map((column) => column.id),
    ).toEqual(['c1', 'c2']);
  });

  it('finds a user by id', () => {
    expect(boardsFeature.selectUserById('u_1').projector(state.users)?.name).toBe('Ada');
    expect(boardsFeature.selectUserById(undefined).projector(state.users)).toBeUndefined();
  });
});
