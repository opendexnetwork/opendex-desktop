export type GithubRelease = {
  tag_name: string;
  html_url: string;
  assets: ReleaseAsset[];
};

type ReleaseAsset = {
  name: string;
  browser_download_url: string;
};
