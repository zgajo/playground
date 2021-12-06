class Tracker {
  constructor() {
    this.host = new Map();
  }

  allocate() {
    throw new Error("your code here");
  }
  deallocate() {
    throw new Error("your code here");
  }
}

class SilentTracker extends Tracker {
  constructor() {
    super();
  }

  allocate(hostType) {
    // your code here
    const hostTypeObject = this.host.get(hostType);

    // host type has empty space for tracker
    if (!hostTypeObject) {
      const newHostTypeName = `${hostType}1`;
      this.host.set(hostType, { trackers: [true] });
      this.host.set(newHostTypeName, { hostType, newHostTypeName });
      return newHostTypeName;
    }

    const trackers = hostTypeObject.trackers;

    for (let i = 0; i < trackers.length; i++) {
      if (!trackers[i]) {
        trackers[i] = true;
        const newHostTypeName = `${hostType}${i + 1}`;

        this.host.set(newHostTypeName, { hostType, newHostTypeName });
        this.host.set(hostType, { trackers });

        return newHostTypeName;
      }
    }

    // set at the end of host type
    trackers.push(true);
    const newHostTypeName = `${hostType}${trackers.length}`;

    this.host.set(hostType, { trackers });
    this.host.set(newHostTypeName, { hostType, newHostTypeName });

    return newHostTypeName;
  }

  deallocate(hostName) {
    // your code here
    const hostTracker = this.host.get(hostName);

    if (hostTracker) {
      const hostType = hostTracker.hostType;
      const indexOfDeletedTracker =
        hostTracker.newHostTypeName.split(hostType)[1];

      this.host.delete(hostName);

      const host = this.host.get(hostType);
      const trackers = host.trackers;

      trackers[indexOfDeletedTracker - 1] = false;
      this.host.set(hostType, { trackers });
    }
    return "";
  }
}

module.exports.SilentTracker = SilentTracker;
