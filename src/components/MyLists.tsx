'use client';

import { Link } from 'next-view-transitions';
import classNames from 'classnames';
import { CreateList } from '@/components/CreateList';
import { randomColor } from '@/utils/randomColor';
import { useState } from 'react';
import { Close } from '@/components/icons/Close';
import { gql } from 'graphql-request';
import { client } from '@/lib/client';

export type TodoList = {
  id: number;
  created_at: string;
  name: string;
  email: string;
};

type MyListsProps = {
  list: TodoList[];
};

const DELETE_LIST_MUTATION = gql`
  mutation DeleteList($id: Int!) {
    deleteTODOList(id: $id)
  }
`;

export const MyLists = ({ list = [] }: MyListsProps) => {
  const [todoLists, setTodoLists] = useState<TodoList[]>(list);

  const onCreateHandler = (newTodoList: TodoList) => {
    setTodoLists([...todoLists, newTodoList]);
  };

  const onDeletedHandler = (id: number) => {
    client
      .request(DELETE_LIST_MUTATION, {
        id: id,
      })
      .then(() => {
        setTodoLists(todoLists.filter((item) => item.id !== id));
      });
  };

  return (
    <div className="flex flex-col gap-8 text-center">
      <h1 className="text-4xl">
        {todoLists.length > 0 ? 'My TODO lists' : 'No lists yet!'}
      </h1>
      <ul>
        {todoLists.map((item) => (
          <li key={item.id}>
            <Link
              href={item.id.toString()}
              className={classNames(
                'py-2 pl-4 pr-2 bg-gray-900 rounded-lg mb-4 flex justify-between items-center min-h-16 text-black hover:scale-[1.02] transform transition duration-300 ease-in-out',
                randomColor(),
              )}
            >
              {item.name}
              <div className="flex gap-2">
                <button
                  className="btn btn-square btn-error"
                  onClick={(e) => {
                    onDeletedHandler(item.id);
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                >
                  <Close />
                </button>
              </div>
            </Link>
          </li>
        ))}
      </ul>
      <CreateList onCreate={onCreateHandler} />
    </div>
  );
};
