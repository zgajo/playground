import { SilentTracker } from "../silent-tracker";

describe("SilentTracker", () => {
  let tracker;
  beforeEach(() => {
    tracker = new SilentTracker();
  });

  it("allocate and deallocate", () => {
    expect(tracker.allocate("api")).toEqual("api1");
    expect(tracker.allocate("api")).toEqual("api2");
    expect(tracker.deallocate("api2")).toEqual("");
    expect(tracker.deallocate("api100")).toEqual("");
    expect(tracker.allocate("api")).toEqual("api2");
    expect(tracker.allocate("api")).toEqual("api3");
    expect(tracker.allocate("api")).toEqual("api4");
    expect(tracker.deallocate("api3")).toEqual("");
    expect(tracker.allocate("api")).toEqual("api3");
  });
});
