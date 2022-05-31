import { displayShortPublicKey } from "@/lib/utils";

describe("Utils", () => {
  describe("displayShortPublicKey", () => {
    it("displays empty string if not valid base58 string", () => {
      const result = displayShortPublicKey("");
      expect(result).toBe("");
    });

    it("displays empty shortened string if valid base58 value", () => {
      const pk = "abcdefabcdefabcdefabcdefabcdefabcdefabcdeffg";
      const result = displayShortPublicKey(pk);
      expect(result).toBe("0xabcd..effg");
    });
  });
});
