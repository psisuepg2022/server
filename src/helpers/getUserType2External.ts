const getUserType2External = (userDomainClass: string): string =>
  `USER_TYPE_${userDomainClass.split(".").pop()?.toUpperCase() || "ERROR"}`;

export { getUserType2External };
