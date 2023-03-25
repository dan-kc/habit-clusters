import * as Dialog from "@radix-ui/react-dialog";
import { useState } from "react";
import { Cluster as ClusterType } from "@utils/types";
import Cluster from "./Cluster";
import EditClusterDialog from "./EditClusterDialog";
import { v4 as uuidv4 } from "uuid";
import { PlusIcon } from "@radix-ui/react-icons";

interface Props {
  clusters: ClusterType[];
}

const ClusterList: React.FC<Props> = ({ clusters }) => {
  const [addingCluster, setAddingCluster] = useState<boolean>(false);
  return (
    <section className="flex flex-col gap-2">
      {clusters.map((cluster) => {
        const { id, name, start_time, end_time, habits } =
          cluster;
        return (
          <Cluster
            id={id}
            key={id}
            name={name}
            startTime={start_time}
            endTime={end_time}
            habits={habits}
          />
        );
      })}
      <Dialog.Root open={addingCluster} onOpenChange={setAddingCluster}>
        {
          clusters.length === 0 ?
            <Dialog.Trigger asChild>
              <button className="rounded-md border text-2xl font-semibold border-violetDark-6 bg-violetDark-3 py-10 text-violetDark-11 flex justify-center  text-center">
                Add your first cluster!
              </button>
            </Dialog.Trigger>
            :
            <div className="flex justify-start">
              <Dialog.Trigger asChild>
                <button className="flex h-10 w-10 justify-center rounded-full bg-violetDark-3">
                  <PlusIcon className="h-5 w-5 self-center text-violetDark-11" />
                </button>
              </Dialog.Trigger>
            </div>
        }
        <EditClusterDialog
          isNew
          id={uuidv4()}
          open={addingCluster}
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
