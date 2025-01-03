import cx from "classnames";
import PropTypes from "prop-types";
import { t } from "ttag";

import CS from "metabase/css/core/index.css";
import Search from "metabase/entities/search";
import { DEFAULT_SEARCH_LIMIT } from "metabase/lib/constants";
import { SearchResult } from "metabase/search/components/SearchResult/SearchResult";
import { Box, Icon } from "metabase/ui";

import { CONTAINER_WIDTH } from "../constants";

import S from "./SearchResults.module.css";

const propTypes = {
  databaseId: PropTypes.string,
  searchQuery: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired,
  searchModels: PropTypes.arrayOf(
    PropTypes.oneOf(["card", "dataset", "table", "metric"]),
  ),
};

export function SearchResults({
  searchQuery,
  onSelect,
  databaseId,
  searchModels,
}) {
  const query = {
    q: searchQuery,
    models: searchModels,
    limit: DEFAULT_SEARCH_LIMIT,
  };

  if (databaseId) {
    query["table_db_id"] = databaseId;
  }

  return (
    <Box w={CONTAINER_WIDTH} className={S.Root}>
      <Search.ListLoader query={query} wrapped reload debounced>
        {({ list }) => {
          if (list.length === 0) {
            return (
              <div
                className={cx(
                  CS.flex,
                  CS.flexColumn,
                  CS.alignCenter,
                  CS.justifyCenter,
                  CS.p4,
                  CS.textMedium,
                  CS.textCentered,
                )}
              >
                <div className={CS.my4}>
                  <Icon name="search" className={CS.mb1} size={32} />
                  <h3 className={CS.textLight}>{t`No results found`}</h3>
                </div>
              </div>
            );
          }

          return (
            <ul>
              {list.map(item => (
                <li key={`${item.id}_${item.model}`}>
                  <SearchResult
                    result={item}
                    onClick={onSelect}
                    compact
                    showDescription={false}
                  />
                </li>
              ))}
            </ul>
          );
        }}
      </Search.ListLoader>
    </Box>
  );
}

SearchResults.propTypes = propTypes;
