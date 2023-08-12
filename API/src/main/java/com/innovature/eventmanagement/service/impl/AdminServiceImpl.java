package com.innovature.eventmanagement.service.impl;

import com.innovature.eventmanagement.entity.Admin;
import com.innovature.eventmanagement.entity.Category;
import com.innovature.eventmanagement.entity.Organizer;
import com.innovature.eventmanagement.entity.User;
import com.innovature.eventmanagement.exception.BadRequestException;
import com.innovature.eventmanagement.form.AdminLoginForm;
import com.innovature.eventmanagement.form.CategoryForm;
import com.innovature.eventmanagement.form.RefreshTokenForm;
import com.innovature.eventmanagement.repository.AdminRepository;
import com.innovature.eventmanagement.repository.CategoryRepository;
import com.innovature.eventmanagement.repository.OrganizerRepository;
import com.innovature.eventmanagement.repository.UserRepository;
import com.innovature.eventmanagement.security.config.SecurityConfig;
import com.innovature.eventmanagement.security.util.InvalidTokenException;
import com.innovature.eventmanagement.security.util.TokenExpiredException;
import com.innovature.eventmanagement.security.util.TokenGenerator;
import com.innovature.eventmanagement.security.util.TokenGenerator.Token;
import com.innovature.eventmanagement.security.util.TokenGenerator.VerificationStatus;
import com.innovature.eventmanagement.service.AdminService;
import com.innovature.eventmanagement.util.CategoryUtil;
import com.innovature.eventmanagement.util.Constants;
import com.innovature.eventmanagement.util.LanguageUtil;
import com.innovature.eventmanagement.util.Pager;
import com.innovature.eventmanagement.view.AdminLoginView;
import com.innovature.eventmanagement.view.CategoryListView;
import com.innovature.eventmanagement.view.CategoryView;
import com.innovature.eventmanagement.view.CountView;
import com.innovature.eventmanagement.view.OrganizerListView;
import com.innovature.eventmanagement.view.RefreshTokenView;
import com.innovature.eventmanagement.view.UserListView;
import java.util.List;
import java.util.stream.StreamSupport;
import javax.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

/*
 * Description : Admin Service Implementation
 * Author Name : Manu Ravi
 */
@Service
public class AdminServiceImpl implements AdminService {

  private final Logger logger = LoggerFactory.getLogger(AdminServiceImpl.class);

  @Autowired
  private AdminRepository adminRepository;

  @Autowired
  private CategoryRepository categoryRepository;

  @Autowired
  private UserRepository userRepository;

  @Autowired
  private OrganizerRepository organizerRepository;

  @Autowired
  private LanguageUtil languageUtil;

  @Autowired
  private CategoryUtil categoryUtil;

  @Value("${global.language}")
  private String globalLanguage;

  @Autowired
  private PasswordEncoder passwordEncoder;

  @Autowired
  private SecurityConfig securityConfig;

  @Autowired
  private TokenGenerator tokenGenerator;

  // Log in an admin using the provided login form.
  @Override
  public AdminLoginView login(AdminLoginForm form) {
    Admin admin = adminRepository.findByEmail(form.getEmail()).orElseThrow(
        () -> new BadRequestException(languageUtil.getTranslatedText(Constants.EMAIL_NOT_FOUND, null, globalLanguage)));
    // Check if the provided password matches the admins stored password.
    if (!passwordEncoder.matches(form.getPassword(), admin.getPassword())) {
      throw new BadRequestException(
          languageUtil.getTranslatedText(Constants.EMAIL_PASSWORD_INCORRECT, null, globalLanguage));
    }
    String id = String.format(Constants.DIGIT_FORMAT, admin.getId());
    String roleId = String.format(Constants.DIGIT_FORMAT, admin.getRole().ordinal());
    TokenGenerator.Token accessToken = tokenGenerator.create(Constants.PURPOSE_ACCESS_TOKEN, id, roleId,
        securityConfig.getAccessTokenExpiry());
    TokenGenerator.Token refreshToken = tokenGenerator.create(Constants.PURPOSE_REFRESH_TOKEN, id + admin.getPassword(),
        roleId, securityConfig.getRefreshTokenExpiry());
    logger.info("Admin login successfully");

    return new AdminLoginView(admin, accessToken, refreshToken);
  }

  // Method to refresh an access token using a refresh token
  @Override
  public RefreshTokenView refresh(RefreshTokenForm form) throws BadRequestException {
    VerificationStatus status;

    try {
      status = tokenGenerator.verify(Constants.PURPOSE_REFRESH_TOKEN, form.getRefreshToken());
    } catch (InvalidTokenException e) {
      throw new BadRequestException(languageUtil.getTranslatedText(Constants.TOKEN_INVALID, null, globalLanguage));
    } catch (TokenExpiredException e) {
      throw new BadRequestException(languageUtil.getTranslatedText(Constants.TOKEN_EXPIRED, null, globalLanguage));
    }

    int userid;
    try {
      userid = Integer.parseInt(status.data.substring(0, 10).trim());
    } catch (NumberFormatException e) {
      throw new BadRequestException(Constants.TOKEN_INVALID, e);
    }

    String password = status.data.substring(10);

    Admin admin = adminRepository.findByIdAndPassword(userid, password).orElseThrow(() -> new BadRequestException(
        languageUtil.getTranslatedText(Constants.UNABLE_TO_PERFORM, null, globalLanguage)));

    String role = String.format(Constants.DIGIT_FORMAT, admin.getRole().ordinal());
    String id = String.format(Constants.DIGIT_FORMAT, admin.getId());
    Token accessToken = tokenGenerator.create(Constants.PURPOSE_ACCESS_TOKEN, id, role,
        securityConfig.getAccessTokenExpiry());
    logger.info("Refresh token api success");
    return new RefreshTokenView(new RefreshTokenView.TokenView(accessToken.value, accessToken.expiry),
        new RefreshTokenView.TokenView(form.getRefreshToken(), status.expiry));
  }

  // List users - Search, Sort, Pagination, Filter
  @Override
  public Pager<UserListView> listUsers(String search, Integer page, Integer size, String sort, Integer order,
      Integer status) {
    // Validate the page parameter
    if (page < 1) {
      throw new BadRequestException(languageUtil.getTranslatedText(Constants.PAGE_NATURAL, null, globalLanguage));
    }

    // Validate the size parameter
    if (size < 1) {
      throw new BadRequestException(languageUtil.getTranslatedText(Constants.SIZE_NATURAL, null, globalLanguage));
    }

    Direction direction;
    // Validate the order parameter
    if (order == 1) {
      direction = Direction.DESC;
    } else {
      direction = Direction.ASC;
    }

    Pager<UserListView> userPager;
    List<UserListView> userList;
    int countData;

    userList = StreamSupport
        .stream(userRepository.findByStatusInAndNameContainingIgnoreCaseOrEmailContainingIgnoreCase(status, search,
            search, PageRequest.of(page - 1, size, direction, sort)).spliterator(), false)
        .map(UserListView::new).toList();

    countData = userRepository.countByStatusInAndNameContainingIgnoreCaseOrEmailContainingIgnoreCase(status, search,
        search);
    userPager = new Pager<>(size, countData, page);
    userPager.setResult(userList);
    logger.info("Fetched userlist  successfully");
    return userPager;
  }

  // Retrieves the count of active users from the database
  @Override
  public CountView getActiveUserCount() {
    long activeUserCount = userRepository.countByStatus(User.Status.ACTIVE.value);
    logger.info("Fetched active users count");
    return new CountView(activeUserCount);
  }

  // For Activate, deactivate, Delete users with user id
  // status 0 - Activate, 1 - Deactivate, 2 - Delete
  public ResponseEntity<String> manageUser(Long id, String status) {
    try {
      User user = userRepository.findById(id).orElseThrow(
          () -> new BadRequestException(languageUtil.getTranslatedText(Constants.INVALID_ID, null, globalLanguage)));
      // User is DELETED, throw BadRequestException with the corresponding message
      if (user.getStatus() == User.Status.DELETE.value) {
        String errorMessage = languageUtil.getTranslatedText(Constants.USER_DELETED, null, globalLanguage);
        throw new BadRequestException(errorMessage);
      }
      // Checks status matches values (0, 1, or 2)
      if (!status.matches("[012]")) {
        throw new BadRequestException(languageUtil.getTranslatedText(Constants.INVALID_STATUS, null, globalLanguage));
      }
      byte statusValue = Byte.parseByte(status);
      user.setStatus(statusValue);
      userRepository.save(user);
      logger.info("User status changed successfully");
      return new ResponseEntity<>(HttpStatus.OK);
    } catch (NumberFormatException ex) {
      throw new BadRequestException(languageUtil.getTranslatedText(Constants.INVALID_ID, null, globalLanguage));
    }

  }

  // For saving a new category
  public ResponseEntity<String> addCategory(@Valid CategoryForm form) {
    categoryUtil.checkDuplication(form.getName()); // Check for duplication
    Category category = new Category();
    category.setName(form.getName());
    category.setStatus(Category.Status.ACTIVE.value);
    categoryRepository.save(category);
    logger.info("Category added successfully");
    return new ResponseEntity<>(HttpStatus.OK);
  }

  // Fetch active category list
  @Override
  public Pager<CategoryListView> getCategoryList(String search, Integer page, Integer size, String sort,
      Integer order) {
    if (page < 1) {
      throw new BadRequestException(languageUtil.getTranslatedText(Constants.PAGE_NATURAL, null, globalLanguage));
    }

    // Validate the size parameter
    if (size < 1) {
      throw new BadRequestException(languageUtil.getTranslatedText(Constants.SIZE_NATURAL, null, globalLanguage));
    }

    Direction direction;
    // Validate the order parameter
    if (order == 1) {
      direction = Direction.DESC;
    } else {
      direction = Direction.ASC;
    }

    List<CategoryListView> categoryList = StreamSupport
        .stream(categoryRepository.findByStatusAndNameContainingIgnoreCase(Category.Status.ACTIVE.value, search,
            PageRequest.of(page - 1, size, direction, sort)).spliterator(), false)
        .map(CategoryListView::new).toList();

    int countData = categoryRepository.countByStatusAndNameContainingIgnoreCase(Category.Status.ACTIVE.value, search);
    Pager<CategoryListView> categoryPager = new Pager<>(size, countData, page);
    categoryPager.setResult(categoryList);
    logger.info("Category fetched successfully");
    return categoryPager;
  }

  // Fetch category detail by id
  @Override
  public CategoryView getCategoryDetail(Long id) {
    Category category = categoryRepository.findByIdAndStatus(id, Category.Status.ACTIVE.value);
    if (category == null) {
      throw new BadRequestException(languageUtil.getTranslatedText(Constants.CATEGORY_NOT_FOUND, null, globalLanguage));
    } else {
      logger.info("Fetched category detail successfully");
      return new CategoryView(category);
    }
  }

  // Update category by category id and from data
  @Override
  public ResponseEntity<String> categoryUpdate(Long id, @Valid CategoryForm form) {
    Category existingCategory = categoryRepository.findByIdAndStatus(id, Category.Status.ACTIVE.value);

    if (existingCategory == null) {
      throw new BadRequestException(languageUtil.getTranslatedText(Constants.CATEGORY_NOT_FOUND, null, globalLanguage));
    }

    // Check for duplication excluding the current category
    Category duplicateCategory = categoryRepository.findByNameAndStatusAndIdNot(form.getName(),
        Category.Status.ACTIVE.value, id);

    if (duplicateCategory != null) {
      throw new BadRequestException(languageUtil.getTranslatedText(Constants.CATEGORY_DUPLICATE, null, globalLanguage));
    }

    existingCategory.setName(form.getName());
    categoryRepository.save(existingCategory);
    logger.info("Category update successfully");
    return new ResponseEntity<>(HttpStatus.OK);
  }
  
  // Soft delete category by id
  @Override
  public ResponseEntity<String> categoryDelete(Long id) {
    Category existingCategory = categoryRepository.findByIdAndStatus(id, Category.Status.ACTIVE.value);
    // Checks if category doesn't exist
    if (existingCategory == null) {
      throw new BadRequestException(languageUtil.getTranslatedText(Constants.CATEGORY_NOT_FOUND, null, globalLanguage));
    } else {
      existingCategory.setStatus(Category.Status.DELETED.value);
      categoryRepository.save(existingCategory);
      logger.info("Category delete successfully");
      return new ResponseEntity<>(HttpStatus.OK);
    }
  }

  // Organizer list with search, sort and pagination
  @Override
  public Pager<OrganizerListView> listOrganizers(String search, Integer page, Integer size, String sort, Integer order,
      Integer status) {
    if (page < 1) {
      // page number validation
      throw new BadRequestException(languageUtil.getTranslatedText(Constants.PAGE_NATURAL, null, globalLanguage));
    }
    if (size < 1) {
      // size value validation
      throw new BadRequestException(languageUtil.getTranslatedText(Constants.SIZE_NATURAL, null, globalLanguage));
    }
    Direction direction;
    if (order == 1) {
      direction = Direction.DESC;
    } else {
      direction = Direction.ASC;
    }

    Pager<OrganizerListView> organizerPager;
    List<OrganizerListView> organizerList;
    int countData;
    organizerList = StreamSupport
        .stream(organizerRepository.findByStatusInAndNameContainingIgnoreCaseOrEmailContainingIgnoreCase(status, search,
            search, PageRequest.of(page - 1, size, direction, sort)).spliterator(), false)
        .map(OrganizerListView::new).toList();
    countData = organizerRepository.countByStatusInAndNameContainingIgnoreCaseOrEmailContainingIgnoreCase(status,
        search, search);
    organizerPager = new Pager<>(size, countData, page);
    organizerPager.setResult(organizerList);
    return organizerPager;
  }

  // Delete, block or unblock organizer
  // Status 0 -> Active, 1-> Blocked, 2 -> Deleted
  @Override
  public ResponseEntity<String> DeleteOrganizer(Long id, String status) {
    try {
      // check if the organizer with the given id is present in the system
      Organizer organizer = organizerRepository.findById(id).orElseThrow(
          () -> new BadRequestException(languageUtil.getTranslatedText(Constants.INVALID_ID, null, globalLanguage)));
      // checks if the given organizer is already deleted
      if (organizer.getStatus() == Organizer.Status.DELETE.value) {
        throw new BadRequestException(
            languageUtil.getTranslatedText(Constants.ORGANIZER_DELETED, null, globalLanguage));
      }
      // checks if the status provided is valid
      if (!status.matches("[012]")) {
        throw new BadRequestException(languageUtil.getTranslatedText(Constants.INVALID_STATUS, null, globalLanguage));
      }
      // Sets the status value to the new value
      byte newStatus = Byte.parseByte(status);
      organizer.setStatus(newStatus);
      organizerRepository.save(organizer);
      return new ResponseEntity<>(HttpStatus.OK);
    } catch (NumberFormatException exp) {
      throw new BadRequestException(languageUtil.getTranslatedText(Constants.INVALID_ID, null, globalLanguage));
    }
  }

  // Find active organizers count
  @Override
  public CountView ActiveOrganizerCount() {
    long OrganizerCount = organizerRepository.countByStatus(Organizer.Status.ACTIVE.value);
    return new CountView(OrganizerCount);
  }
}
