const PAGES_HOSTNAME = "notecluster.pages.dev";
const API_HOST_ORIGIN = "https://notecluster.selfkit.org";

export function gatewayPath(path: string): string {
  if (window.location.hostname === PAGES_HOSTNAME) {
    return `${API_HOST_ORIGIN}${path}`;
  }

  return path;
}
