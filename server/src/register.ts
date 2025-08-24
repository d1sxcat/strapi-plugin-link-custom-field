import type { Core } from '@strapi/strapi';

const register = ({ strapi }: { strapi: Core.Strapi }) => {
  strapi.customFields.register({
    name: "link",
    plugin: "link-custom-field",
    type: "string",
    inputSize: {
      // optional
      default: 4,
      isResizable: true,
    },
  });
};

export default register;
