# == Schema Information
#
# Table name: restaurants
#
#  id          :bigint           not null, primary key
#  address     :string           not null
#  description :text
#  name        :string           not null
#  phone       :string           not null
#  website     :string
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  city_id     :integer          not null
#
# Indexes
#
#  index_restaurants_on_city_id  (city_id)
#  index_restaurants_on_name     (name)
#

class Restaurant < ApplicationRecord
    validates :name, :address, :phone, presence: true

    belongs_to :city, inverse_of: :restaurants

    has_many :cuisines, inverse_of: :restaurant, dependent: :destroy

    has_many :operation_hours, inverse_of: :restaurant, dependent: :destroy
    has_many :operation_timeslots, through: :operation_hours, source: :timeslot

    has_many :reservations, inverse_of: :restaurant, dependent: :destroy

    has_many :reviews, inverse_of: :restaurant, dependent: :destroy
    has_many :reviewers,
        through: :reviews,
        source: :user

    has_many :favorites, inverse_of: :restaurant, dependent: :destroy
    has_many :supporters,
        through: :favorites,
        source: :user

    def self.find_by_search(search_term)
        # restaurants = Restaurant.includes(:city).includes(:cuisines)

        res_city = Restaurant.joins(:city).where("lower(cities.name) like ?", "%#{search_term.downcase}%").includes(:operation_hours).includes(:reservations)
        res_name = Restaurant.where("lower(name) like ?", "%#{search_term.downcase}%").includes(:operation_hours).includes(:reservations)
        res_cuisine = Restaurant.joins(:cuisines).where("lower(cuisines.name) like ?", "%#{search_term.downcase}%").includes(:operation_hours).includes(:reservations)

        result = res_city + res_name + res_cuisine
    end

    def hours_of_operation
        timeslots = self.operation_hours.includes(:timeslot)
        opendays = Hash.new { |h, k| h[k] = [] }

        timeslots.each do |timeslot|
            opendays[timeslot.timeslot.day] << timeslot.timeslot.time
        end

        opendays
    end

    def open_close_hours
        opendays = self.hours_of_operation
        open_close = Hash.new {|h,k| h[k] = {} }

        opendays.each do |day, hours|
            value = { "open" => hours.min, "close" => hours.max }
            open_close[day] = value

        end

        open_close
    end

    def map_cuisine_by_name
        cuisines = self.cuisines

        names = cuisines.map { |cuisine| cuisine.name }

        names
    end

    def restaurant_capacity(timeslot_id)
        timeslot = self.operation_hours.find_by(timeslot_id: timeslot_id)
        timeslot ? timeslot.capacity : 0
    end

    def find_valid_reservations(date, timeslot_id)
        self.reservations.where(
            date: date,
            timeslot_id: timeslot_id,
            cancellation: false
        )
    end

    def reserved_seats(date, timeslot_id)
        self.find_valid_reservations(date, timeslot_id).pluck(:seats).sum
    end

    def available_seats(date, timeslot_id)
        self.restaurant_capacity(timeslot_id) - self.reserved_seats(date, timeslot_id)
    end

    def find_timeslots(requested_date, requested_seats, req_timeslot, reqday_timeslots)
        req_timeslot_idx = reqday_timeslots.index(req_timeslot)
        before_timeslots = reqday_timeslots[0...req_timeslot_idx]
        after_timeslots = reqday_timeslots[req_timeslot_idx + 1..-1]

        prior = []
        latter = []

        before_timeslots.each do |timeslot|
            if self.available_seats(requested_date, timeslot.id) >= requested_seats
                prior.push(timeslot)
            end
        end

        after_timeslots.each do |timeslot|
            if self.available_seats(requested_date, timeslot.id) >=
                requested_seats
                latter.push(timeslot)
            end
        end

        while prior.length < 2
            prior.unshift('none')
        end

        while latter.length < 2
            latter.push('none')
        end

        if self.available_seats(requested_date, req_timeslot.id) < requested_seats
            req_timeslot = 'none'
        end

        available_timeslots = prior[-2..-1].concat([req_timeslot]).concat(latter[0..1])
        
        if available_timeslots.uniq.length == 1
            return []
        else
            return available_timeslots
        end

    end

    def num_reviews
        self.reviews.count
    end

    def ratings_array
        self.reviews.pluck(:rating)
    end

    def avg_rating
        reviews_count = self.num_reviews

        return 0 if reviews_count == 0

        total_ratings = self.ratings_array.sum

        total_ratings * 1.0 / reviews_count
    end
end


