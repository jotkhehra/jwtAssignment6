import { useAtom } from 'jotai';
import { useRouter } from 'next/router';
import { ListGroup, Card, Button } from 'react-bootstrap';
import { searchHistoryAtom } from '../store';
import { removeFromHistory } from '../lib/userData';
import styles from '@/styles/History.module.css';

const History = () => {
  const [searchHistory, setSearchHistory] = useAtom(searchHistoryAtom);
  const router = useRouter();

  if (!searchHistory) return null;

  let parsedHistory = [];
  searchHistory.forEach(h => {
    let params = new URLSearchParams(h);
    let entries = params.entries();
    parsedHistory.push(Object.fromEntries(entries));
  });

  const historyClicked = (e, index) => {
    e.preventDefault();
    router.push(`/artwork?${searchHistory[index]}`);
  };

  const removeHistoryClicked = async (e, index) => {
    e.stopPropagation();
    setSearchHistory(await removeFromHistory(searchHistory[index]));
  };

  return (
    <>
      {parsedHistory.length === 0 ? (
        <Card>
          <Card.Body>
            <h4>Nothing Here</h4>
            <p>Try searching for some artwork.</p>
          </Card.Body>
        </Card>
      ) : (
        <ListGroup>
          {parsedHistory.map((historyItem, index) => (
            <ListGroup.Item
              key={index}
              onClick={e => historyClicked(e, index)}
              className={styles.historyListItem}
            >
              {Object.keys(historyItem).map(key => (
                <div key={key}>
                  {key}: <strong>{historyItem[key]}</strong>&nbsp;
                </div>
              ))}
              <Button
                className="float-end"
                variant="danger"
                size="sm"
                onClick={e => removeHistoryClicked(e, index)}
              >&times;</Button>
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
    </>
  );
};

export default History;
