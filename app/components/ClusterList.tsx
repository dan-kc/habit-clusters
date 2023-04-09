import * as Dialog from '@radix-ui/react-dialog';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { PlusIcon } from '@radix-ui/react-icons';
import Cluster from '@components/Cluster';
import ClusterDialog from '@components/ClusterDialog';
import type { Cluster as ClusterType } from '~/utils/types';

interface Props {
  clusters: ClusterType[];
}

const ClusterList: React.FC<Props> = ({ clusters }) => {
  const [open, setOpen] = useState<boolean>(false);
  return (
    <section className="flex flex-col gap-2">
      {clusters.map((cluster) => (
        <Cluster cluster={cluster} />
      ))}
      <Dialog.Root open={open} onOpenChange={setOpen}>
        {clusters.length === 0 ? (
          <Dialog.Trigger asChild>
            <button
              data-cy="add_cluster"
              className="flex justify-center rounded-md border border-violetDark-6 bg-violetDark-3 py-10 text-center text-2xl font-semibold  text-violetDark-11"
            >
              Add your first cluster!
            </button>
          </Dialog.Trigger>
        ) : (
          <div className="flex justify-start">
            <Dialog.Trigger asChild>
              <button
                data-cy="add_cluster"
                className="flex h-10 w-10 justify-center rounded-full bg-violetDark-3"
              >
                <PlusIcon className="h-5 w-5 self-center text-violetDark-11" />
              </button>
            </Dialog.Trigger>
          </div>
        )}
        <ClusterDialog
          isNew
          id={uuidv4()}
          open={open}
          name=""
          startTime="00:00"
          endTime="23:59"
          habits={[]}
        />
      </Dialog.Root>
    </section>
  );
};

export default ClusterList;
