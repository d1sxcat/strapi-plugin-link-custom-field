import * as yup from 'yup';

const schema = yup.object({
  data: yup.array(
    yup.object({
      contenttype: yup.string(),
      createdAt: yup.string(),
      documentId: yup.string().required(),
      generated: yup.boolean(),
      id: yup.number(),
      locale: yup.string(),
      publishedAt: yup.string(),
      updatedAt: yup.string(),
      url_path: yup.string().required(),
    })
  ),
  meta: yup.object({
    pagination: yup.object({
      page: yup.number().required(),
      pageCount: yup.number().required(),
      pageSize: yup.number().required(),
      total: yup.number().required(),
    }),
  }),
});

export type Tschema = yup.InferType<typeof schema>;

export { schema };

