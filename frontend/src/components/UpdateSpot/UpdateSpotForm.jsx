import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { getInfoById, updateSpot } from '../../store/spot';

const UpdateSpotForm = () => {
    const { spotId } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const spotDetails = useSelector(state => state.spots.spotDetails);
    const [form, setForm] = useState({
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

    useEffect(() => {
        dispatch(getInfoById(spotId));
    }, [dispatch, spotId]);

    useEffect(() => {
        if (spotDetails && spotDetails.id === parseInt(spotId)) {
            setForm({
                country: spotDetails.country || '',
                address: spotDetails.address || '',
                city: spotDetails.city || '',
                state: spotDetails.state || '',
                lat: spotDetails.lat || '',
                lng: spotDetails.lng || '',
                description: spotDetails.description || '',
                name: spotDetails.name || '',
                price: spotDetails.price || '',
                previewImageUrl: spotDetails.SpotImages?.find(img => img.preview)?.url || '',
                imageUrls: spotDetails.SpotImages?.filter(img => !img.preview).map(img => img.url) || ['', '', '', ''],
            });
        }
    }, [spotDetails, spotId]);

    const onInputChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setErrors({});

        const validationErrors = {};
        if (!form.country) validationErrors.country = 'Country is required';
        if (!form.address) validationErrors.address = 'Address is required';
        if (!form.city) validationErrors.city = 'City is required';
        if (!form.state) validationErrors.state = 'State is required';
        if (!form.description || form.description.length < 30)
            validationErrors.description = 'Description needs a minimum of 30 characters';
        if (!form.name) validationErrors.name = 'Name is required';
        if (!form.price) validationErrors.price = 'Price is required';

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
    

        const updatedSpotData = {
            country: form.country,
            address: form.address,
            city: form.city,
            state: form.state,
            lat: form.lat || null,
            lng: form.lng || null,
            name: form.name,
            description: form.description,
            price: form.price,
        };

        try {
            await dispatch(updateSpot(spotId, updatedSpotData));
            navigate(`/spots/${spotId}`);
        } catch (error) {
            console.error('Failed to update the spot:', error);
        }
    };
    return (
        <form onSubmit={onSubmit} className="update-spot-form">
    <h2>Update Your Spot</h2>

    <label>
        Country
        <input
            type="text"
            name="country"
            value={form.country}
            onChange={onInputChange}
        />
        {errors.country && <p className="error">{errors.country}</p>}
    </label>

    <label>
        Street Address
        <input
            type="text"
            name="address"
            value={form.address}
            onChange={onInputChange}
        />
        {errors.address && <p className="error">{errors.address}</p>}
    </label>

    <label>
        City
        <input
            type="text"
            name="city"
            value={form.city}
            onChange={onInputChange}
        />
        {errors.city && <p className="error">{errors.city}</p>}
    </label>

    <label>
        State
        <input
            type="text"
            name="state"
            value={form.state}
            onChange={onInputChange}
        />
        {errors.state && <p className="error">{errors.state}</p>}
    </label>

    <label>
        Latitude
        <input
            type="text"
            name="lat"
            value={form.lat}
            onChange={onInputChange}
            placeholder="e.g., 37.7749"
        />
    </label>

    <label>
        Longitude
        <input
            type="text"
            name="lng"
            value={form.lng}
            onChange={onInputChange}
            placeholder="e.g., -122.4194"
        />
    </label>

    <label>
        Description
        <textarea
            name="description"
            value={form.description}
            onChange={onInputChange}
            placeholder="Describe your spot in detail"
        />
        {errors.description && <p className="error">{errors.description}</p>}
    </label>

    <label>
        Name of Your Spot
        <input
            type="text"
            name="name"
            value={form.name}
            onChange={onInputChange}
            placeholder="Catchy title for your spot"
        />
        {errors.name && <p className="error">{errors.name}</p>}
    </label>

    <label>
        Price Per Night (USD)
        <input
            type="number"
            name="price"
            value={form.price}
            onChange={onInputChange}
            placeholder="e.g., 100"
        />
        {errors.price && <p className="error">{errors.price}</p>}
    </label>

    <label>
        Preview Image URL
        <input
            type="text"
            name="previewImageUrl"
            value={form.previewImageUrl}
            onChange={onInputChange}
            placeholder="Enter a .jpg, .jpeg, or .png URL"
        />
        {errors.previewImageUrl && <p className="error">{errors.previewImageUrl}</p>}
    </label>

    <label>
        Additional Image URLs
        {form.imageUrls.map((url, index) => (
            <input
                key={index}
                type="text"
                placeholder={`Image URL ${index + 1}`}
                value={url}
                onChange={(e) => {
                    const updatedImageUrls = [...form.imageUrls];
                    updatedImageUrls[index] = e.target.value;
                    setForm({ ...form, imageUrls: updatedImageUrls });
                }}
            />
        ))}
    </label>

    <button type="submit" className="update-button">
        Update Spot
    </button>
</form>

    )
}

export default UpdateSpotForm;