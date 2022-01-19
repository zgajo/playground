import { Ox } from "./osmnx";
import { NetworkTypeEnum } from "./osmnx/interface/graph";
import { graphFromAdressDefaultParams } from "./utils/constants";

Ox.graphFromAdress({
  ...graphFromAdressDefaultParams,
  address: "Rovinjsko selo, Croatia",
  networkType: NetworkTypeEnum.DRIVE,
});
