import { useEffect, useState } from "react";
import { fetchData } from "./utils";
import { Beer } from "../../types";
import { Link as RouterLink } from "react-router-dom";
import {
  Button,
  Checkbox,
  Paper,
  TextField,
  Link,
  SelectChangeEvent,
} from "@mui/material";
import styles from "./Home.module.css";

const Home = () => {
  const [searchInput, setSearchInput] = useState("");
  const [remove, setRemove] = useState(false);
  const [reload, setReload] = useState(false);
  const [filteredResults, setFilteredResults] = useState<Array<Beer>>([]);
  const [beerList1, setBeerList1] = useState<Array<Beer>>([]);
  const [beerList, setBeerList] = useState<Array<Beer>>([]);
  const stored =
    localStorage["listOfFavorites"] !== undefined
      ? JSON.parse(localStorage["listOfFavorites"])
      : "";

  const [savedList, setSavedList] = useState(stored);
  const searchItems = (searchValue: string) => {
    setSearchInput(searchValue);
    setFilteredResults(
      beerList.filter((item: any) => {
        return Object.values(item)
          .join("")
          .toLowerCase()
          .includes(searchInput.toLowerCase());
      })
    );
  };
  useEffect(() => {
    localStorage.setItem("listOfFavorites", JSON.stringify(savedList));
  }, [savedList, remove]);

  const handleChange = (e: any) => {
    const { name, checked } = e.target;
    const newList = beerList.map((beer: Beer) => {
      if (beer.name === name) {
        beer.isChecked = !beer.isChecked;
        if (!checked) {
          setSavedList([
            ...savedList.filter((item: Beer) => item.name !== beer.name),
          ]);
          localStorage.setItem("listOfFavorites", JSON.stringify(savedList));
        } else {
          setSavedList([...savedList, { ...beer, isChecked: checked }]);
          localStorage.setItem("listOfFavorites", JSON.stringify(savedList));
        }
      }
      return beer;
    });
    setBeerList(newList);
    localStorage.setItem("listOfBeers", JSON.stringify(beerList));
  };

  useEffect(() => {
    const listOfBeers =
      localStorage["listOfBeers"] !== undefined
        ? JSON.parse(localStorage["listOfBeers"])
        : beerList1;
    setBeerList(listOfBeers);
    if (remove === true) {
      setSavedList([]);
      localStorage.setItem("listOfFavorites", JSON.stringify(savedList));

      const newList = beerList.map((beer: Beer) => {
        if (beer.isChecked) beer.isChecked = false;
        return beer;
      });
      setBeerList1(newList);
      localStorage.clear();
      setRemove(!remove);
    }
    if (reload === true) {
      const listOfBeers =
        localStorage["listOfBeers"] !== undefined
          ? JSON.parse(localStorage["listOfBeers"])
          : beerList;
      setBeerList(listOfBeers);
      setSavedList(savedList);
      localStorage.setItem("listOfFavorites", JSON.stringify(savedList));
      setReload(!reload);
    }
  }, [beerList1, remove, reload]);

  useEffect(() => fetchData.bind(this, setBeerList1), []);
  return (
    <article>
      <section>
        <main>
          <Paper>
            <div className={styles.listContainer}>
              <div className={styles.listHeader}>
                <TextField
                  label="Filter..."
                  variant="outlined"
                  onChange={(e: any) => searchItems(e.target.value)}
                />
                <Button
                  variant="contained"
                  onClick={() => {
                    setReload(true);
                  }}
                >
                  Reload list
                </Button>
              </div>
              <ul className={styles.list}>
                {searchInput.length > 1
                  ? filteredResults.map((beer, index) => (
                      <li key={index.toString()}>
                        <Checkbox
                          color="primary"
                          checked={beer.isChecked || false}
                          name={beer.name}
                          onChange={(e: SelectChangeEvent) => handleChange(e)}
                        />
                        <Link component={RouterLink} to={`/beer/${beer.id}`}>
                          {beer.name}
                        </Link>
                      </li>
                    ))
                  : beerList.map((beer: Beer, index: number) => (
                      <li key={index.toString()}>
                        <Checkbox
                          color="primary"
                          name={beer.name}
                          checked={beer.isChecked || false}
                          onChange={(e: SelectChangeEvent) => handleChange(e)}
                        />
                        <Link component={RouterLink} to={`/beer/${beer.id}`}>
                          {beer.name}
                        </Link>
                      </li>
                    ))}
              </ul>
            </div>
          </Paper>

          <Paper>
            <div className={styles.listContainer}>
              <div className={styles.listHeader}>
                <h3>Saved items</h3>
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => {
                    setRemove(true);
                  }}
                >
                  Remove all items
                </Button>
              </div>
              <ul className={styles.list}>
                {savedList &&
                  savedList.map((beer: Beer, index: number) => (
                    <li key={index.toString()}>
                      <Link component={RouterLink} to={`/beer/${beer.id}`}>
                        {beer.name}
                      </Link>
                    </li>
                  ))}
                {!savedList.length && <p>No saved items</p>}
              </ul>
            </div>
          </Paper>
        </main>
      </section>
    </article>
  );
};

export default Home;
