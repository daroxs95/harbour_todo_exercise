import { Todo, Todos } from '@/components/Todos';
import { gql } from 'graphql-request';
import { client } from '@/lib/client';

type MyListPageMetadata = {
  params: { listId: string };
}

export async function generateMetadata({ params }: MyListPageMetadata) {
  return {
    title: `TODO List ${params.listId}`,
  };
}

type MyListPageProps = MyListPageMetadata;

const GET_TODO_QUERY = gql`
    query GetTODOs($listId: Int!) {
        getTODOs(listId: $listId) {
            id
            desc
            finished
        }
    }
`;

export default async function MyListPage({ params: { listId } }: MyListPageProps) {
  const { getTODOs } = await client.request<{ getTODOs: Todo[] }>(GET_TODO_QUERY, {
    listId: +listId,
  });

  return (
    <div className="flex align-center justify-center p-16 sm:p-8">
      <Todos
        listId={parseInt(listId)}
        list={getTODOs ?? []}
      />
    </div>
  );
}
