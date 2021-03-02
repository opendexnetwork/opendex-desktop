export const getErrorMsg = (err: unknown): string => {
  if (typeof err == "string") {
    return err;
  }
  const message = (err as any)["message"];
  const messageStr = message ? message : JSON.stringify(err);
  if (messageStr.startsWith("rpc error") && messageStr.includes("desc =")) {
    const desc = messageStr.substring(messageStr.indexOf("desc ="));
    const messageStart = desc.indexOf("=") + 2;
    return desc.substring(messageStart);
  }
  return messageStr;
};
