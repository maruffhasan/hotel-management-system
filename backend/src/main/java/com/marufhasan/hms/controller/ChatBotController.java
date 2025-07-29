package com.marufhasan.hms.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.genai.Client;
import com.google.genai.types.GenerateContentResponse;
import com.marufhasan.hms.DTO.RoomDetailsDTO;
import com.marufhasan.hms.model.Hotel;
import com.marufhasan.hms.repository.HotelRepository;
import com.marufhasan.hms.repository.room.RoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api")
public class ChatBotController {

    RestTemplate restTemplate = new RestTemplate();

    @Autowired
    RoomRepository roomRepository;
    @Autowired
    HotelRepository hotelRepository;

    private List<RoomDetailsDTO> getAllRooms() {
        return roomRepository.getRooms();
    }

    private Hotel getHotelDetails() {
        return hotelRepository.getDetails();
    }


    @GetMapping("/chatbot")
    public String chatbot(@RequestParam String qns) throws JsonProcessingException {
            // The client gets the API key from the environment variable `GOOGLE_API_KEY`.

        ObjectMapper objectMapper = new ObjectMapper();

        String roomsInfo = objectMapper.writeValueAsString(getAllRooms());
        String hotelInfo = objectMapper.writeValueAsString(getHotelDetails());

        String prompt = "You are a helpful and knowledgeable hotel assistant AI.\n\n" +
                "Hotel Details:\n" + hotelInfo + "\n\n" +
                "Available Rooms:\n" + roomsInfo + "\n\n" +
                "User's Question:\n" + qns + "\n\n" +
                "Based on the above hotel details and available rooms, " +
                "please provide a clear, friendly, and informative answer to the user's question. " +
                "(give answer in html format so that frontend can direct render to user)";

        Client client = new Client();

        GenerateContentResponse response =
                client.models.generateContent(
                        "gemini-2.5-flash",
                        prompt,
                        null);
        return response.text();
    }


}
