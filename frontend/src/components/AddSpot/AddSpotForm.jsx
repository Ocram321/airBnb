import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AddSpot } from '../../store/spot';
import './AddSpotForm.css'

const AddSpotForm = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [spotForm, setSpotForm] = useState({
        country: '',
        address: '',
        city: '',
        state: '',
        lat: '',
        lng: '',
        description: '',
        name: '',
        price: '',
        previewImageUrl: '',
        imageUrls: ['', '', '', ''],
    });
    const [errors, setErrors] = useState({});

    const onInputChange = (e) => {
        const { name, value } = e.target;
        setSpotForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const onImageUrlChange = (index, value) => {
        const updatedImageUrls = [...spotForm.imageUrls];
        updatedImageUrls[index] = value;
        setSpotForm({ ...spotForm, imageUrls: updatedImageUrls });
    };

    const onSubmit = async (e) => {
        e.preventDefault()
        const validationErrors = {};

        if (!spotForm.country) validationErrors.country = 'Country is required';
        if (!spotForm.address) validationErrors.address = 'Address is required';
        if (!spotForm.city) validationErrors.city = 'City is required';
        if (!spotForm.state) validationErrors.state = 'State is required';
        if (!spotForm.description || spotForm.description.length < 30) {
            validationErrors.description = 'Description needs a minimum of 30 characters';
        }
        if (!spotForm.name) validationErrors.name = 'Name is required';
        if (!spotForm.price) validationErrors.price = 'Price is required';
        if (!spotForm.previewImageUrl) {
            validationErrors.previewImageUrl = 'Preview image is required';
        } else if (!spotForm.previewImageUrl.match(/\.(png|jpg|jpeg)$/i)) {
            validationErrors.previewImageUrl = 'Image URL must end in .png, .jpg, or .jpeg';
        }

        spotForm.imageUrls.forEach((url, index) => {
            if (url && !url.match(/\.(png|jpg|jpeg)$/i)) {
                validationErrors[`imageUrls[${index}]`] = 'Image URL must end in .png, .jpg, or .jpeg';
            }
        });

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        const newSpotData = {
            ...spotForm,
            imageUrls: [spotForm.previewImageUrl, ...spotForm.imageUrls.filter((url) => url)], // Combine images
        };


        try {
            const newSpot = await dispatch(AddSpot(newSpotData));
            navigate(`/spots/${newSpot.id}`);
        } catch (err) {
            console.error('Failed to create spot', err);
        }
    };

    return (
        <form onSubmit={onSubmit} className="add-spot-form">
        <h1>Create a new Spot</h1>
      
        <h3>Where&apos;s your place located?</h3>
        <div>
          Guests will only get your exact address once they booked a reservation.
        </div>
        <br />
      
        <label>Country</label>
        <input name="country" value={spotForm.country} onChange={onInputChange} />
        {errors.country && <p className="error">{errors.country}</p>}
      
        <label>Street Address</label>
        <input name="address" value={spotForm.address} onChange={onInputChange} />
        {errors.address && <p className="error">{errors.address}</p>}
      
        <label>City</label>
        <input name="city" value={spotForm.city} onChange={onInputChange} />
        {errors.city && <p className="error">{errors.city}</p>}
      
        <label>State</label>
        <input name="state" value={spotForm.state} onChange={onInputChange} />
        {errors.state && <p className="error">{errors.state}</p>}
      
        <label>Latitude</label>
        <input name="lat" value={spotForm.lat} onChange={onInputChange} />
      
        <label>Longitude</label>
        <input name="lng" value={spotForm.lng} onChange={onInputChange} />
      
        <hr />
      
        <h3>Describe your place to guests</h3>
        <div>
          Mention the best features of your space, any special amenities like fast wifi or
          parking, and what you love about the neighborhood.
        </div>
        <br />
      
        <textarea
          name="description"
          value={spotForm.description}
          onChange={onInputChange}
          placeholder="Description needs a minimum of 30 characters"
        />
        {errors.description && <p className="error">{errors.description}</p>}
      
        <h3>Create a title for your spot</h3>
        <div>
          Catch guests&apos; attention with a spot title that highlights what makes your place
          special.
        </div>
        <br />
      
        <input
          name="name"
          placeholder="Name of your spot"
          value={spotForm.name}
          onChange={onInputChange}
        />
        {errors.name && <p className="error">{errors.name}</p>}
      
        <h3>Set a base price for your spot</h3>
        <div>
          Competitive pricing can help your listing stand out and rank higher in search results.
        </div>
        <br />
      
        <input
          type="number"
          name="price"
          placeholder="Price per night (USD)"
          value={spotForm.price}
          onChange={onInputChange}
        />
        {errors.price && <p className="error">{errors.price}</p>}
      
        <h3>Liven up your spot with photos</h3>
        <div>Submit a link to at least one photo to publish your spot.</div>
        <br />
      
        <label>Preview Image URL</label>
        <input
          name="previewImageUrl"
          placeholder="Preview Image URL"
          value={spotForm.previewImageUrl}
          onChange={onInputChange}
        />
        {errors.previewImageUrl && <p className="error">{errors.previewImageUrl}</p>}
      
        {spotForm.imageUrls.map((url, index) => (
          <div key={index}>
            <label>Image URL</label>
            <input
              placeholder={`Image URL ${index + 1}`}
              value={url}
              onChange={(e) => onImageUrlChange(index, e.target.value)}
            />
            {errors[`imageUrls[${index}]`] && (
              <p className="error">{errors[`imageUrls[${index}]`]}</p>
            )}
          </div>
        ))}
      
        <button type="submit">Create Spot</button>
      </form>
    )
}
export default AddSpotForm;