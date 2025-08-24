import { Combobox, ComboboxOption, Flex } from '@strapi/design-system';
import { forwardRef, Fragment } from 'react';
import { useFetchClient } from '@strapi/strapi/admin';
import { useInfiniteQuery } from 'react-query';
import { Field } from '@strapi/design-system';
import type { CustomFieldProps } from './Providers/Providers';
import { schema } from './validator';
import { stringify } from 'qs';
import { useIntl } from 'react-intl';
import { errorFormatting } from '../utils/errorFormatting';
import { getTranslation } from '../utils/getTranslation';

const PAGE_SIZE = 25;

export const Input = forwardRef<HTMLInputElement, CustomFieldProps>(
  (
    {
      name,
      hint,
      disabled,
      required,
      labelAction,
      label,
      attribute,
      onChange,
      value,
      placeholder,
      error,
    },
    ref
  ) => {
    const { get } = useFetchClient();
    const { formatMessage } = useIntl();

    const {
      data,
      error: queryError,
      fetchNextPage,
      hasNextPage,
      isFetching,
      isFetchingNextPage,
      status,
    } = useInfiniteQuery({
      queryKey: ['webtools', 'links'],
      async queryFn({ pageParam = 1 }) {
        const { data } = await get(
          `webtools/url-alias/findMany${stringify(
            {
              pagination: {
                page: pageParam,
                pageSize: PAGE_SIZE,
              },
            },
            { addQueryPrefix: true, encodeValuesOnly: true }
          )}`
        );
        const validatedData = await schema.validate(data);
        return validatedData;
      },
      getNextPageParam: (lastPage) =>
        lastPage.meta.pagination.page < lastPage.meta.pagination.pageCount
          ? lastPage.meta.pagination.page + 1
          : undefined,
    });
    const handleChange = (e?: string) => {
      onChange({
        target: { name, type: attribute.type, value: e ?? null },
      });
    };

    return (
      <Field.Root name={name} hint={hint} error={error} disabled={disabled} required={required}>
        <Field.Label action={labelAction}>{label}</Field.Label>
        <Combobox
          ref={ref}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          loading={status === 'loading' || isFetching || isFetchingNextPage}
          loadingMessage={formatMessage({
            id: getTranslation('loading.message'),
            defaultMessage: 'Loading...',
          })}
          hasMoreItems={(!isFetching && !isFetchingNextPage && hasNextPage) || false}
          onClear={() => handleChange()}
          onLoadMore={fetchNextPage}
          noOptionsMessage={() =>
            status === 'error'
              ? formatMessage({
                  id: getTranslation(errorFormatting(queryError)),
                  defaultMessage: 'An error occurred',
                })
              : formatMessage({
                  id: getTranslation('options.notfound'),
                  defaultMessage: 'No options',
                })
          }
        >
          {data?.pages?.map((group, i) => (
            <Fragment key={i}>
              {group.data?.map(({ url_path, locale }) => (
                <ComboboxOption key={url_path} value={url_path}>
                  <Flex alignItems="center" justifyContent="space-between" gap={2}>
                    <span>{url_path}</span>
                    <span>
                      <strong>{locale}</strong>
                    </span>
                  </Flex>
                </ComboboxOption>
              ))}
            </Fragment>
          ))}
        </Combobox>
        <Field.Hint />
        <Field.Error />
      </Field.Root>
    );
  }
);
