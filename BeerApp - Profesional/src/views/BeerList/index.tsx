import { useEffect, useState } from "react";
import { Beer } from "../../types";
import { fetchData } from "./utils";
import styles from "./BeerList.module.css";

import {
  Avatar,
  List,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  MenuItem,
} from "@mui/material";
import Select, { SelectChangeEvent } from "@mui/material/Select";

import SportsBar from "@mui/icons-material/SportsBar";
import { useNavigate } from "react-router-dom";
import Pagination from "@mui/material/Pagination";

const BeerList = () => {
  const navigate = useNavigate();
  const pageSize = 10;
  const [pagination, setPagination] = useState({
    count: 0,
    from: 0,
    to: pageSize,
  });

  const service = {
    getData: ({ from, to }: any) => {
      return new Promise((resolve, reject) => {
        const data = beerList.slice(from, to);
        resolve({
          count: beerList.length,
          data: data,
        });
      });
    },
  };
  const [beerList, setBeerList] = useState<Array<Beer>>([]);
  const [sortType, setSortType] = useState("asc");
  const [beerListPaginated, setBeerListPaginated] = useState<Array<Beer>>([]);
  // eslint-disable-next-line
  useEffect(fetchData.bind(this, setBeerList), []);

  useEffect(() => {
    const sortNameArray = (type: string) => {
      setBeerListPaginated((prevBeers) => {
        const beersCopy = [...prevBeers];

        beersCopy.sort((a: Beer, b: Beer) => {
          if (type === "asc") {
            return a.name > b.name ? 1 : -1;
          } else {
            return b.name > a.name ? 1 : -1;
          }
        });
        console.log(beersCopy);
        return beersCopy;
      });
    };
    sortNameArray(sortType);
  }, [sortType]);

  const handleChange = (event: SelectChangeEvent) => {
    setSortType(event.target.value as string);
  };
  useEffect(() => {
    service
      .getData({ from: pagination.from, to: pagination.to })
      .then((response: any) => {
        setPagination({ ...pagination, count: response.count });
        setBeerListPaginated(response.data);
      });
  }, [pagination.to, pagination.from, beerList]);

  const onBeerClick = (id: string) => navigate(`/beer/${id}`);
  const handlePageChange = (event: any, page: any) => {
    const from = (page - 1) * pageSize;
    const to = (page - 1) * pageSize + pageSize;
    setPagination({ ...pagination, from: from, to: to });
  };

  return (
    <article>
      <section>
        <header>
          <h1>BeerList page</h1>
        </header>
        <main>
          <Select
            defaultValue="asc"
            onChange={handleChange}
            className={styles.select}
          >
            <MenuItem value="asc"> Asc</MenuItem>
            <MenuItem value="dsc">Dsc</MenuItem>
          </Select>
          <List>
            {beerListPaginated.map((beer) => (
              <ListItemButton
                key={beer.id}
                onClick={onBeerClick.bind(this, beer.id)}
              >
                <ListItemAvatar>
                  <Avatar>
                    <SportsBar />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={beer.name}
                  secondary={beer.brewery_type}
                />
              </ListItemButton>
            ))}
            <Pagination
              className={styles.pagination}
              count={Math.ceil(pagination.count / pageSize)}
              color="primary"
              onChange={handlePageChange}
            />
          </List>
        </main>
      </section>
    </article>
  );
};

export default BeerList;
