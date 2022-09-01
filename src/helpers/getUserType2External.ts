const getUserType2External = (userDomainClass: string): string =>
  userDomainClass.split(".").pop() || "";

export { getUserType2External };
