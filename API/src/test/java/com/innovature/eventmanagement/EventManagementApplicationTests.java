package com.innovature.eventmanagement;

import org.junit.jupiter.api.Test;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.ApplicationContext;

import static org.hibernate.validator.internal.util.Contracts.assertNotNull;

@SpringBootTest
class EventManagementApplicationTests {

	@Test
	void contextLoads() {
		// Assert that the Spring context loads successfully
		ApplicationContext context = SpringApplication.run(EventManagementApplication.class);
		assertNotNull(context, "Spring context");
	}

}
