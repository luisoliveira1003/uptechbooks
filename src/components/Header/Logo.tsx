import { Link, Text } from "@chakra-ui/react";

export function Logo() {
  return (
    <Link href="/">
      <Text
        fontSize={["2xl", "3xl"]}
        fontWeight="bold"
        letterSpacing="tight"
        w="64"
      >
        Up! Tech
        <Text as="span" ml="1" color="pink.500">
          Riachuelo
        </Text>
      </Text>
    </Link>
  );
}
