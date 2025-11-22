import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { fetchNoteByIdServer } from "@/lib/api/serverApi";
import getQueryClient from "@/lib/getQueryClient";
import Modal from "@/components/Modal/Modal";
import NoteDetailsClient from "@/app/(privat routes)/notes/[id]/NoteDetails.client";

function NoteModal({ noteId }: { noteId: string }) {
  return (
    <Modal onClose={() => window.history.back()}>
      <NoteDetailsClient />
    </Modal>
  );
}

export default async function InterceptedNotePage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteByIdServer(id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NoteModal noteId={id} />
    </HydrationBoundary>
  );
}
