import { ofetch, type FetchOptions } from "ofetch";

export default function createFetch(option: FetchOptions) {
  globalThis.$fetch = ofetch.create({
    ...option,
  });
}
