import { ButtonGroup, Flex, IconButton } from "@chakra-ui/react";

export default function SecondaryActionButtons() {
  return (
    <Flex gap={2}>
      <ButtonGroup size="sm" isAttached variant="solid">
        <IconButton />
      </ButtonGroup>
      <ButtonGroup size="sm" isAttached variant="solid"></ButtonGroup>
    </Flex>
  );
}
