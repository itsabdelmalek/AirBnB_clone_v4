$('document').ready(function () {
  const api = 'http://' + window.location.hostname;

  $.get(api + ':5001:/api/v1/status/', function (response) {
    if (response.status === 'OK') {
      $('DIV#api_status').addClass('available');
    } else {
      $('DIV#api_status').removeClass('available');
    }
  });

  $.ajax({
    url: api + ':5001/api/v1/places_search/',
    type: 'POST',
    data: '{}',
    contentType: 'application/json',
    dataType: 'json',
    success: appendPlaces
  });

  let states = {};
  $('.locations > UL > H2 > INPUT[type="checkbox"]').change(function () {
    if ($(this).is(':checked')) {
      states[$(this).attr('data-id')] = $(this).attr('data-name');
    } else {
      delete states[$(this).attr('data-id')];
    }
    const locations = Object.assign({}, states, cities);
    if (Object.values(locations).length === 0) {
      $('.locations H4').html('&nbsp;');
    } else {
      $('.locations H4').text(Object.values(locations).join(', '));
    }
  });

  let cities = {};
  $('.locations > UL > UL > LI INPUT[type="checkbox"]').change(function () {
    if ($(this).is(':checked')) {
      cities[$(this).attr('data-id')] = $(this).attr('data-name');
    } else {
      delete cities[$(this).attr('data-id')];
    }
    const locations = Object.assign({}, states, cities);
    if (Object.values(locations).length === 0) {
      $('.locations H4').html('&nbsp;');
    } else {
      $('.locations H4').text(Object.values(locations).join(', '));
    }
  });

  let amenities = {};
  $('.amenities INPUT[type="checkbox"]').change(function () {
    if ($(this).is(':checked')) {
      amenities[$(this).attr('data-id')] = $(this).attr('data-name');
    } else {
      delete amenities[$(this).attr('data-id')];
    }
    if (Object.values(amenities).length === 0) {
      $('.amenities H4').html('&nbsp;');
    } else {
      $('.amenities H4').text(Object.values(amenities).join(', '));
    }
  });

  $('BUTTON').click(function () {
    $.ajax({
      url: api + ':5001/api/v1/places_search/',
      type: 'POST',
      data: JSON.stringify({
        'states': Object.keys(states),
        'cities': Object.keys(cities),
        'amenities': Object.keys(amenities)
      }),
      contentType: 'application/json',
      dataType: 'json',
      success: appendPlaces
    });
  });
});

function appendPlaces (data) {
  $('SECTION.places').empty();
  $('SECTION.places').append(data.map(place => {
    return `<ARTICLE>
              <DIV class="title">
                <H2>${place.name}</H2>
                  <DIV class="price_by_night">
                    ${place.price_by_night}
                  </DIV>
                </DIV>
                <DIV class="information">
                  <DIV class="max_guest">
                    <I class="fa fa-users fa-3x" aria-hidden="true"></I>
                    </BR>
                    ${place.max_guest} Guests
                  </DIV>
                  <DIV class="number_rooms">
                    <I class="fa fa-bed fa-3x" aria-hidden="true"></I>
                    </BR>
                    ${place.number_rooms} Bedrooms
                  </DIV>
                  <DIV class="number_bathrooms">
                    <I class="fa fa-bath fa-3x" aria-hidden="true"></I>
                    </BR>
                    ${place.number_bathrooms} Bathrooms
                  </DIV>
                </DIV>
                <DIV class="description">
                  ${place.description}
                </DIV>
              </ARTICLE>`;
  }));
}

  $('section.reviews .toggle').click(function () {
    const showHide = $(this).text();
    if (showHide === 'show') {
      $(this).text('hide');
      fetchReviews();
    } else {
      $(this).text('show');
      $('section.reviews .review-content').empty();
    }
  });

  function fetchReviews() {
    $.ajax({
      url: api + ':5001/api/v1/places/<PLACE_ID>/reviews',
      type: 'GET',
      dataType: 'json',
      success: function (data) {
        const reviewContent = $('section.reviews .review-content');
        reviewContent.empty();
        data.forEach(function (review) {
          const reviewElement = $('<div>').addClass('review');
          const userDate = $('<h3>').text(`From ${review.user} the ${review.date}`);
          const reviewText = $('<p>').text(review.text);
          reviewElement.append(userDate, reviewText);
          reviewContent.append(reviewElement);
        });
      },
      error: function () {
        console.error('Error fetching reviews');
      }
    });
  }
});