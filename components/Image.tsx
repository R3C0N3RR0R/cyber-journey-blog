import NextImage, { ImageProps } from "next/image";

const basePath = process.env.BASE_PATH;

const Image = ({ src, ...rest }: ImageProps) => {
  const computedSrc: ImageProps["src"] =
    typeof src === "string" ? `${basePath || ""}${src}`.trimEnd() : src;
  return <NextImage src={computedSrc} {...rest} />;
};

export default Image;
