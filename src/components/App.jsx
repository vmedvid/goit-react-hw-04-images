import css from './App.module.css';
import { useState, useEffect } from 'react';
import { Searchbar } from './Searchbar/Searchbar';
import * as API from '../services/API';
import { ImageGallery } from './ImageGallery/ImageGallery';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { Button } from './Button/Button';
import { Loader } from './Loader/Loader';
import { Modal } from './Modal/Modal';

export const App = () => {
  const [word, setWord] = useState('');
  const [gallery, setGallery] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isMore, setIsMore] = useState(false);
  const [modalImg, setModalImg] = useState(null);

  const handlerSubmit = word => {
    setWord(word);
    setGallery([]);
    setIsLoading(true);

    requestToApi(word, []);
  };

  const requestToApi = async (word, currentGallery) => {
    setIsLoading(true);
    try {
      const { reqGallery, isMoreImg } = await API.getData(
        word,
        Math.floor(currentGallery.length / 12) + 1
      );

      if (reqGallery.length === 0) {
        Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      }

      setGallery([...currentGallery, ...reqGallery]);
      setIsMore(isMoreImg);
      setWord(word);
    } catch (error) {
      console.error(error);
      setWord('');
      setGallery([]);
      setIsMore(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handlerMore = () => {
    requestToApi(word, gallery);
  };

  const onClickToGallery = modalImage => {
    setModalImg(modalImage);
  };

  const closeModal = () => setModalImg(null);

  return (
    <div className={css.App}>
      {modalImg && (
        <Modal closeWindow={closeModal}>
          <img src={modalImg?.img} alt={modalImg?.alt} />
        </Modal>
      )}
      <Searchbar onSubmit={handlerSubmit} />
      <ImageGallery images={gallery} onClickToGallery={onClickToGallery} />
      <Loader visible={isLoading} />
      {isMore && <Button onClick={handlerMore} />}
    </div>
  );
};

// export class App extends Component {
//   state = {
//     word: '',
//     gallery: [],
//     isLoading: false,
//     isMore: false,
//     modalImg: null,
//   };

// handlerSubmit = word => {
//   this.setState({
//     word,
//     gallery: [],
//     isLoading: true,
//   });
//   this.requestToApi(word, []);
// };

// requestToApi = async (word, currentGallery) => {
//   this.setState({ isLoading: true });
//   try {
//     const { reqGallery, isMore } = await API.getData(
//       word,
//       Math.floor(currentGallery.length / 12) + 1
//     );

//     if (reqGallery.length === 0) {
//       Notify.failure(
//         'Sorry, there are no images matching your search query. Please try again.'
//       );
//     }

//     this.setState({
//       gallery: [...currentGallery, ...reqGallery],
//       isMore,
//       word,
//     });
//   } catch (error) {
//     console.error(error);
//     this.setState({
//       word: '',
//       gallery: [],
//       isMore: false,
//     });
//   } finally {
//     this.setState({ isLoading: false });
//   }
// };

// handlerMore = () => {
//   this.requestToApi(this.state.word, this.state.gallery);
// };

// onClickToGallery = modalImg => {
//   this.setState({ modalImg });
// };

// closeModal = () => this.setState({ modalImg: null });

// render() {
//   const { gallery, isLoading, isMore, modalImg } = this.state;

//     return (
//       <div className={css.App}>
//         {modalImg && (
//           <Modal closeWindow={this.closeModal}>
//             <img src={modalImg?.img} alt={modalImg?.alt} />
//           </Modal>
//         )}
//         <Searchbar onSubmit={this.handlerSubmit} />
//         <ImageGallery
//           images={gallery}
//           onClickToGallery={this.onClickToGallery}
//         />
//         <Loader visible={isLoading} />
//         {isMore && <Button onClick={this.handlerMore} />}
//       </div>
//     );
//   }
// }
