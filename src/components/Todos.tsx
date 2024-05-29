'use client';

import { useState } from 'react';
import { Heart } from '@/components/icons/Heart';
import { Close } from '@/components/icons/Close';
import { AddTodo } from '@/components/AddTodo';
import { gql } from 'graphql-request';
import { client } from '@/lib/client';
import { Reorder } from 'framer-motion';
import { ArrowLeft } from '@/components/icons/ArrowLeft';
import { Link } from 'next-view-transitions';

export type Todo = {
  id: number;
  desc: string;
  finished: boolean;
};

type TodosProps = {
  listId: number;
  list: Todo[];
};

const ADD_TODO_MUTATION = gql`
  mutation AddTODO($listId: Int!, $desc: String!) {
    addTODO(listId: $listId, desc: $desc) {
      id
      desc
      finished
    }
  }
`;

const REMOVE_TODO_MUTATION = gql`
  mutation RemoveTODO($id: Int!, $listId: Int!) {
    removeTODO(id: $id, listId: $listId)
  }
`;

const FINISH_TODO_MUTATION = gql`
  mutation FinishTODO($id: Int!, $listId: Int!) {
    finishTODO(id: $id, listId: $listId) {
      id
      desc
      finished
    }
  }
`;

export const Todos = ({ list = [], listId }: TodosProps) => {
  const [todos, setTodos] = useState<Todo[]>(list);

  const onAddHandler = (desc: string) => {
    client
      .request<{ addTODO: Todo }>(ADD_TODO_MUTATION, {
        listId,
        desc,
      })
      .then((data) => {
        setTodos((prev) => [...prev, data.addTODO]);
      });
  };

  const onRemoveHandler = (id: number) => {
    client
      .request(REMOVE_TODO_MUTATION, {
        id,
        listId,
      })
      .then(() => {
        setTodos((prev) => prev.filter((item) => item.id !== id));
      });
  };

  const onFinishHandler = (id: number) => {
    client
      .request<{ finishTODO: Todo }>(FINISH_TODO_MUTATION, {
        id,
        listId,
      })
      .then((data) => {
        setTodos((prev) =>
          prev.map((item) => (item.id === id ? data.finishTODO : item)),
        );
      });
  };

  return (
    <div>
      <Link href="/" className="btn btn-primary">
        <ArrowLeft />
      </Link>
      <h2 className="text-center text-5xl mb-10">My TODO list</h2>
      <Reorder.Group
        values={todos}
        onReorder={(newOrder) => setTodos(newOrder as Todo[])}
      >
        {todos.map((item) => (
          <Reorder.Item
            key={item.id}
            value={item}
            className="py-2 pl-4 pr-2 bg-gray-900 rounded-lg mb-4 flex justify-between items-center min-h-16"
          >
            <p className={item.finished ? 'line-through' : ''}>{item.desc}</p>
            {!item.finished && (
              <div className="flex gap-2">
                <button
                  className="btn btn-square btn-accent"
                  onClick={() => onFinishHandler(item.id)}
                >
                  <Heart />
                </button>
                <button
                  className="btn btn-square btn-error"
                  onClick={() => onRemoveHandler(item.id)}
                >
                  <Close />
                </button>
              </div>
            )}
          </Reorder.Item>
        ))}
      </Reorder.Group>
      <AddTodo onAdd={onAddHandler} />
    </div>
  );
};
