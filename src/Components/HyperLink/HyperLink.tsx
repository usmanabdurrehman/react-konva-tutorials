import { Box, Flex, IconButton, Input, Link } from "@chakra-ui/react";
import { useState } from "react";
import { Pencil, Trash } from "../../icons";

interface HyperLinkProps {
  link: string;
  onDelete: () => void;
  onSuccess: (link: string) => void;
}

export const HyperLink = ({ link, onDelete, onSuccess }: HyperLinkProps) => {
  const [linkText, setLinkText] = useState(link);
  const [isEditMode, setIsEditMode] = useState(false);

  return (
    <Flex
      alignItems={"center"}
      justifyContent="space-between"
      boxShadow={"sm"}
      borderRadius="sm"
      p={1}
    >
      <Box>
        {isEditMode ? (
          <Input
            value={linkText}
            onKeyDown={(e) => {
              if (e.key === "enter") {
                setIsEditMode(false);
                onSuccess(linkText);
              }
            }}
            onChange={(e) => setLinkText(e.target.value)}
          />
        ) : (
          <a target="_blank" href={link}>
            link
          </a>
        )}
      </Box>
      <Flex>
        <IconButton
          aria-label="edit"
          size="sm"
          icon={<Pencil />}
          onClick={() => setIsEditMode(true)}
        />
        <IconButton
          aria-label="delete"
          size="sm"
          color="red"
          icon={<Trash />}
          onClick={onDelete}
        />
      </Flex>
    </Flex>
  );
};
